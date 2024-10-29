import { sqliteTable, text } from "drizzle-orm/sqlite-core";

export const anonymousCollection = sqliteTable('users', {
    id: text('id',{length:20}).notNull().primaryKey(),
    name:text('name',{length:50}).notNull(),
    partnerName:text('partner_name',{length:256}).notNull(),
    date:text('data',{length:256}).notNull(),
    createdAt:text('created_at').default(new Date().toString())
});

export const feedbacks = sqliteTable('feedbacks', {
    id: text('id',{length:20}).notNull().primaryKey(),
    name: text('name',{length:50}).notNull(),
    phone: text('phone',{length:50}).notNull(),
    message: text('message',{length:500}).notNull(),
    createdAt:text('created_at').default(new Date().toString())
})