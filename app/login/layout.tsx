import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login",
  description: "Sign in to your DNvites account to manage your wedding invitations and RSVPs.",
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
