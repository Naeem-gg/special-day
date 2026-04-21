import { pgTable, serial, text, timestamp, integer, boolean, jsonb } from "drizzle-orm/pg-core";

export const admins = pgTable("admins", {
  id: serial("id").primaryKey(),
  username: text("username").unique().notNull(),
  password: text("password").notNull(),
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
  couponId: integer("coupon_id").references(() => coupons.id),
  discountApplied: integer("discount_applied").default(0),
  paidAmount: integer("paid_amount"),
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
