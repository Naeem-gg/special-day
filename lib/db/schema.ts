import { pgTable, serial, text, timestamp, integer, boolean, jsonb } from "drizzle-orm/pg-core";

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
