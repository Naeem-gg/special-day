import { db } from "@/lib/db";
import { testimonials, invitations } from "@/lib/db/schema";
import { eq, desc, and, isNotNull } from "drizzle-orm";
import { NextResponse } from "next/server";

// GET public testimonials
export async function GET() {
  try {
    const data = await db
      .select()
      .from(testimonials)
      .where(eq(testimonials.isPublic, true))
      .orderBy(desc(testimonials.createdAt));
    return NextResponse.json(data);
  } catch (error) {
    console.error("Testimonials GET Error:", error);
    return NextResponse.json({ error: "Failed to fetch testimonials" }, { status: 500 });
  }
}

// POST a new testimonial
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, rating, message } = body;

    if (!name || !email || !rating || !message) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    // Check if the user has a paid invitation
    const paidInvitation = await db
      .select()
      .from(invitations)
      .where(
        and(
          eq(invitations.userEmail, email),
          isNotNull(invitations.razorpayPaymentId)
        )
      )
      .limit(1);

    if (paidInvitation.length === 0) {
      return NextResponse.json({ 
        error: "Verified purchase required. Please use the email you used for your order." 
      }, { status: 403 });
    }

    const newTestimonial = await db.insert(testimonials).values({
      name,
      email,
      rating: parseInt(rating),
      message,
      isPublic: false, // Default to private until admin approves
    }).returning();

    return NextResponse.json(newTestimonial[0]);
  } catch (error) {
    console.error("Testimonials POST Error:", error);
    return NextResponse.json({ error: "Failed to submit testimonial" }, { status: 500 });
  }
}
