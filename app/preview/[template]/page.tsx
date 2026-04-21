import { notFound, redirect } from "next/navigation";
import { jwtVerify } from "jose";
import TemplateRouter from "@/components/templates/TemplateRouter";
import PreviewBanner from "@/components/preview/PreviewBanner";
import WatermarkOverlay from "@/components/preview/WatermarkOverlay";

const SECRET = new TextEncoder().encode(
  (process.env.ENCRYPTION_KEY || "fallback-secret-key-32-chars-min!").padEnd(32, "0").slice(0, 32)
);

interface PageProps {
  params: Promise<{ template: string }>;
  searchParams: Promise<{ token?: string }>;
}

export default async function PreviewPage({ params, searchParams }: PageProps) {
  const { template } = await params;
  const { token } = await searchParams;

  if (!token) {
    redirect(`/preview?error=no_token&template=${template}`);
  }

  let payload: { brideName: string; groomName: string; dateStr: string; template: string };

  try {
    const { payload: p } = await jwtVerify(token, SECRET);
    payload = p as typeof payload;
  } catch {
    redirect(`/preview?error=expired&template=${template}`);
  }

  const startTime = Date.now();

  const mockDate = new Date(payload.dateStr);
  const mockInvitation = {
    brideName: payload.brideName,
    groomName: payload.groomName,
    date: mockDate,
    venue: "Your chosen venue — configure after purchase",
    events: [
      { name: "Ceremony", time: "4:00 PM", location: "Main Hall", description: "Exchange of vows and rings" },
      { name: "Reception", time: "7:00 PM", location: "Grand Ballroom", description: "Dinner, dancing & celebration" },
    ],
    gallery: [] as { url: string; publicId: string }[],
    isPreview: true,
  };

  return (
    <>
      <PreviewBanner template={template} startTime={startTime} />
      <WatermarkOverlay />
      <TemplateRouter template={payload.template || template} {...mockInvitation} />
    </>
  );
}
