import { notFound } from 'next/navigation'
import { db } from '@/lib/db'
import { invitations } from '@/lib/db/schema'
import { eq, sql } from 'drizzle-orm'
import StyleRouter from '@/components/templates/StyleRouter'
import { cookies } from 'next/headers'
import { isInvitationExpired } from '@/lib/invitation-limits'
import { Metadata } from 'next'
import Link from 'next/link'

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const invitation = await db.query.invitations.findFirst({
    where: eq(invitations.slug, slug),
  })

  if (!invitation) return {}

  if (isInvitationExpired(invitation.createdAt, invitation.tier)) {
    return {
      title: 'Invitation expired | DNvites',
      description: 'This wedding invitation is no longer available.',
    }
  }

  const d = new Date(invitation.date)
  const formattedDate =
    d.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }) +
    (d.getHours() !== 0 || d.getMinutes() !== 0
      ? ' at ' +
        d.toLocaleTimeString('en-US', {
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

  if (isInvitationExpired(invitation.createdAt, invitation.tier)) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-[#FFF9F4] px-6">
        <div className="max-w-md text-center space-y-4">
          <h1 className="text-3xl font-serif text-gray-900">This invitation has expired</h1>
          <p className="text-gray-600 text-sm leading-relaxed">
            Hosting for this plan lasted one year from the date it was created. Gold (Premium)
            invitations remain available for life.
          </p>
          <Link href="/" className="inline-block text-[#F43F8F] font-medium hover:underline">
            Create your own on DNvites
          </Link>
        </div>
      </main>
    )
  }

  // Count at most once per visitor per day
  const cookieStore = await cookies()
  const cookieName = `viewed_${slug}`.slice(0, 64)
  if (!cookieStore.get(cookieName)) {
    db.update(invitations)
      .set({ views: sql`${invitations.views} + 1` })
      .where(eq(invitations.id, invitation.id))
      .execute()
      .catch(() => {})

    try {
      cookieStore.set(cookieName, '1', {
        httpOnly: true,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24,
        path: '/',
      })
    } catch {
      // cookies().set may throw in some render contexts — view still counted once here
    }
  }

  const purchaseTier = (invitation.tier || 'basic') as 'basic' | 'standard' | 'premium'

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
        tier={purchaseTier}
      />
    </main>
  )
}
