import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";

const secretKey = "secret"; // In production, use process.env.JWT_SECRET
const key = new TextEncoder().encode(secretKey);

export async function encrypt(payload: any) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("2h")
    .sign(key);
}

export async function decrypt(input: string): Promise<any> {
  const { payload } = await jwtVerify(input, key, {
    algorithms: ["HS256"],
  });
  return payload;
}

export async function login(username: string) {
  // Create the session
  const expires = new Date(Date.now() + 2 * 60 * 60 * 1000);
  const session = await encrypt({ username, expires });

  // Save the session in a cookie
  (await cookies()).set("admin_session", session, { expires, httpOnly: true });
}

export async function logout() {
  // Destroy the session
  (await cookies()).set("admin_session", "", { expires: new Date(0) });
}

export async function getSession() {
  const session = (await cookies()).get("admin_session")?.value;
  if (!session) return null;
  return await decrypt(session);
}

export async function updateSession(request: NextRequest) {
  const session = request.cookies.get("admin_session")?.value;
  if (!session) return null;

  // Refresh the session so it doesn't expire
  const parsed = await decrypt(session);
  parsed.expires = new Date(Date.now() + 2 * 60 * 60 * 1000);
  const res = new Response();
  res.headers.set(
    "Set-Cookie",
    `admin_session=${await encrypt(parsed)}; HttpOnly; Path=/; Expires=${parsed.expires.toUTCString()}`
  );
  return res;
}
