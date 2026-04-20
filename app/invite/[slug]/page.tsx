import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { invitations } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import InvitationHero from "@/components/invitation/InvitationHero";
import Countdown from "@/components/invitation/Countdown";
import EventList from "@/components/invitation/EventList";
import PhotoGallery from "@/components/invitation/PhotoGallery";
import RSVPModal from "@/components/invitation/RSVPModal";
import BackgroundMusic from "@/components/invitation/BackgroundMusic";
import { Button } from "@/components/ui/button";

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
    <main className="min-h-screen bg-white selection:bg-gray-200">
      {invitation.musicUrl && <BackgroundMusic url={invitation.musicUrl} />}

      <InvitationHero
        brideName={invitation.brideName}
        groomName={invitation.groomName}
        date={invitation.date}
      />

      <Countdown targetDate={invitation.date} />

      <EventList events={invitation.events} />

      {invitation.gallery.length > 0 && (
        <PhotoGallery photos={invitation.gallery} />
      )}

      {/* Venue Section (Optional) */}
      <section className="py-24 bg-white text-center">
        <div className="container mx-auto px-4 max-w-2xl">
          <h2 className="text-3xl font-serif text-gray-900 mb-8">The Venue</h2>
          <p className="text-gray-600 font-light text-lg mb-4">
            {invitation.venue}
          </p>
          <div className="h-[1px] w-20 bg-gray-300 mx-auto mt-8" />
        </div>
      </section>

      <section className="py-24 bg-[#faf9f6] text-center border-t border-gray-100 mb-20">
        <h2 className="text-2xl font-serif text-gray-500 italic mb-8">
          We can&apos;t wait to celebrate with you
        </h2>
        <Button
          variant="outline"
          className="rounded-full px-8 py-6 border-gray-200 text-gray-600 hover:text-gray-900"
        >
          Share Invitation
        </Button>
      </section>

      <RSVPModal invitationId={invitation.id} />
    </main>
  );
}
