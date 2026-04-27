import { MetadataRoute } from 'next'
import { db } from "@/lib/db";
import { invitations } from "@/lib/db/schema";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://dnvites.com"

  // Static routes
  const routes = ['', '/login', '/dashboard', '/create'].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'monthly' as const,
    priority: route === '' ? 1 : 0.8,
  }))

  // Dynamic invitation routes
  try {
    const allInvitations = await db.select({ slug: invitations.slug }).from(invitations);
    const invitationRoutes = allInvitations.map((inv) => ({
      url: `${baseUrl}/invite/${inv.slug}`,
      lastModified: new Date().toISOString(),
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    }))
    
    return [...routes, ...invitationRoutes]
  } catch (error) {
    console.error("Error fetching invitations for sitemap:", error);
    return routes
  }
}
