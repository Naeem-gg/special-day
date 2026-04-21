import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { invitations } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import TemplateRouter from "@/components/templates/TemplateRouter";
import BackgroundMusic from "@/components/invitation/BackgroundMusic";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function InvitationPage({ params }: PageProps) {
  const { slug } = await params;

  const invitation = await db.query.invitations.findFirst({
    where: eq(invitations.slug, slug),
  });

  if (!invitation) {
    notFound();
  }

  return (
    <main>
      {invitation.musicUrl && <BackgroundMusic url={invitation.musicUrl} />}
      <TemplateRouter
        template={invitation.template || "rose-gold"}
        brideName={invitation.brideName}
        groomName={invitation.groomName}
        date={invitation.date}
        venue={invitation.venue}
        events={(invitation.events as any[]) || []}
        gallery={(invitation.gallery as any[]) || []}
        musicUrl={invitation.musicUrl || undefined}
        isPreview={false}
        invitationId={invitation.id}
      />
    </main>
  );
}
