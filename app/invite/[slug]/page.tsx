import { notFound } from 'next/navigation'
import { db } from '@/lib/db'
import { invitations } from '@/lib/db/schema'
import { eq, sql } from 'drizzle-orm'
import StyleRouter from '@/components/templates/StyleRouter'

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

  const d = new Date(invitation.date)
  const formattedDate = d.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }) + (d.getHours() !== 0 || d.getMinutes() !== 0
    ? ' at ' + d.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
      })
    : '')

  const title = `💍 Wedding Invitation: ${invitation.brideName} & ${invitation.groomName}`
  const description = `We request the honour of your presence at the wedding celebration of ${invitation.brideName} & ${invitation.groomName}. 📅 Date: ${formattedDate} 📍 Venue: ${invitation.venue}. Click to view details, map directions, and RSVP online.`
  
  const ogImage =
    invitation.gallery && (invitation.gallery as any[]).length > 0
      ? (invitation.gallery as any[])[0].url
      : '/logo.png'

  return {
    title,
    description,
    alternates: {
      canonical: `/invite/${slug}`,
    },
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
      <StyleRouter
        style={invitation.template || 'rose-gold'}
        brideName={invitation.brideName}
        groomName={invitation.groomName}
        date={invitation.date}
        venue={invitation.venue}
        events={(invitation.events as any[]) || []}
        gallery={(invitation.gallery as any[]) || []}
        musicUrl={invitation.musicUrl || undefined}
        ourStory={invitation.ourStory || undefined}
        mapUrl={invitation.mapUrl || undefined}
        rsvpButtonText={invitation.rsvpButtonText || undefined}
        isPreview={false}
        invitationId={invitation.id}
      />
    </main>
  )
}
