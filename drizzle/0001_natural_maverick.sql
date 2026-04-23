CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"password" text,
	"email_verified" boolean DEFAULT false NOT NULL,
	"name" text,
	"login_otp" text,
	"login_otp_expires" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "admins" ADD COLUMN "reset_otp" text;--> statement-breakpoint
ALTER TABLE "admins" ADD COLUMN "reset_otp_expires" timestamp;--> statement-breakpoint
ALTER TABLE "invitations" ADD COLUMN "user_email" text;--> statement-breakpoint
ALTER TABLE "invitations" ADD COLUMN "template" text DEFAULT 'rose-gold' NOT NULL;--> statement-breakpoint
ALTER TABLE "invitations" ADD COLUMN "razorpay_order_id" text;--> statement-breakpoint
ALTER TABLE "invitations" ADD COLUMN "razorpay_payment_id" text;--> statement-breakpoint
ALTER TABLE "invitations" ADD COLUMN "views" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "invitations" ADD COLUMN "language" text DEFAULT 'en' NOT NULL;