import { db } from "@/lib/db";
import { testimonials } from "@/lib/db/schema";
import { desc, eq } from "drizzle-orm";
import HomeClient from "@/components/HomeClient";

export const dynamic = "force-dynamic";

export default async function Home() {
  let publicTestimonials: any[] = [];
  
  try {
    publicTestimonials = await db.select()
      .from(testimonials)
      .where(eq(testimonials.isPublic, true))
      .orderBy(desc(testimonials.createdAt));
  } catch (err) {
    console.error("Home: Failed to fetch testimonials:", err);
  }

  return <HomeClient testimonials={publicTestimonials} />;
}
