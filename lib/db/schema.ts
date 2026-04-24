import { pgTable, serial, text, timestamp, integer, boolean, jsonb } from "drizzle-orm/pg-core";

export const admins = pgTable("admins", {
  id: serial("id").primaryKey(),
  username: text("username").unique().notNull(),
  password: text("password").notNull(),
  resetOtp: text("reset_otp"),
  resetOtpExpires: timestamp("reset_otp_expires"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: text("email").unique().notNull(),
  password: text("password"),
  emailVerified: boolean("email_verified").default(false).notNull(),
  name: text("name"),
  loginOtp: text("login_otp"),
  loginOtpExpires: timestamp("login_otp_expires"),
  otpCountToday: integer("otp_count_today").default(0).notNull(),
  lastOtpAt: timestamp("last_otp_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const tiers = pgTable("tiers", {
  id: serial("id").primaryKey(),
  slug: text("slug").unique().notNull(),
  name: text("name").notNull(),
  price: integer("price").notNull(),
  active: boolean("active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const coupons = pgTable("coupons", {
  id: serial("id").primaryKey(),
  code: text("code").unique().notNull(),
  discountType: text("discount_type").notNull(), // 'percentage' or 'fixed'
  discountValue: integer("discount_value").notNull(),
  expiresAt: timestamp("expires_at"),
  usageLimit: integer("usage_limit"),
  usedCount: integer("used_count").default(0).notNull(),
  active: boolean("active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const invitations = pgTable("invitations", {
  id: serial("id").primaryKey(),
  slug: text("slug").unique().notNull(),
  brideName: text("bride_name").notNull(),
  groomName: text("groom_name").notNull(),
  userEmail: text("user_email"),
  date: timestamp("date").notNull(),
  venue: text("venue").notNull(),
  events: jsonb("events").$type<{
    name: string;
    time: string;
    location: string;
    description?: string;
  }[]>().notNull().default([]),
  gallery: jsonb("gallery").$type<{
    url: string;
    publicId: string;
  }[]>().notNull().default([]),
  musicUrl: text("music_url"),
  backgroundImage: text("background_image"),
  tier: text("tier").notNull().default("basic"),
  template: text("template").notNull().default("rose-gold"),
  couponId: integer("coupon_id").references(() => coupons.id),
  discountApplied: integer("discount_applied").default(0),
  paidAmount: integer("paid_amount"),
  razorpayOrderId: text("razorpay_order_id"),
  razorpayPaymentId: text("razorpay_payment_id"),
  views: integer("views").default(0).notNull(),
  language: text("language").default("en").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const rsvps = pgTable("rsvps", {
  id: serial("id").primaryKey(),
  invitationId: integer("invitation_id").references(() => invitations.id, { onDelete: "cascade" }).notNull(),
  name: text("name").notNull(),
  guests: integer("guests").notNull().default(1),
  attending: boolean("attending").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const testimonials = pgTable("testimonials", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  rating: integer("rating").notNull().default(5),
  message: text("message").notNull(),
  isPublic: boolean("is_public").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
