import { notFound } from 'next/navigation'
import { db } from '@/lib/db'
import { invitations } from '@/lib/db/schema'
import { eq, sql } from 'drizzle-orm'
import TemplateRouter from '@/components/templates/TemplateRouter'
import BackgroundMusic from '@/components/invitation/BackgroundMusic'

import { Metadata } from 'next'

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const invitation = await db.query.invitations.findFirst({
    where: eq(invitations.slug, slug),
  })

  if (!invitation) return {}

  const title = `Wedding Invitation: ${invitation.brideName} & ${invitation.groomName}`
  const description = `Join us in celebrating the wedding of ${invitation.brideName} and ${invitation.groomName} on ${invitation.date}.`
  const ogImage =
    invitation.gallery && (invitation.gallery as any[]).length > 0
      ? (invitation.gallery as any[])[0].url
      : '/og-image.png'

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [ogImage],
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage],
    },
  }
}

export default async function InvitationPage({ params }: PageProps) {
  const { slug } = await params

  const invitation = await db.query.invitations.findFirst({
    where: eq(invitations.slug, slug),
  })

  if (!invitation) {
    notFound()
  }

  // Track view (fire-and-forget, non-blocking)
  db.update(invitations)
    .set({ views: sql`${invitations.views} + 1` })
    .where(eq(invitations.id, invitation.id))
    .execute()
    .catch(() => {})

  return (
    <main>
      {invitation.musicUrl && <BackgroundMusic url={invitation.musicUrl} />}
      <TemplateRouter
        template={invitation.template || 'rose-gold'}
        brideName={invitation.brideName}
        groomName={invitation.groomName}
        date={invitation.date}
        venue={invitation.venue}
        events={(invitation.events as any[]) || []}
        gallery={(invitation.gallery as any[]) || []}
        musicUrl={invitation.musicUrl || undefined}
        ourStory={invitation.ourStory || undefined}
        mapUrl={invitation.mapUrl || undefined}
        isPreview={false}
        invitationId={invitation.id}
      />
    </main>
  )
}
