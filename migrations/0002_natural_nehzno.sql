CREATE TABLE "blog_subscribers" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" varchar(320) NOT NULL,
	"status" varchar(16) DEFAULT 'pending' NOT NULL,
	"confirm_token" varchar(64) NOT NULL,
	"unsubscribe_token" varchar(64) NOT NULL,
	"locale" varchar(8) DEFAULT 'pt-BR' NOT NULL,
	"source" varchar(64),
	"confirmed_at" timestamp,
	"unsubscribed_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX "blog_subscribers_email_idx" ON "blog_subscribers" USING btree ("email");--> statement-breakpoint
CREATE UNIQUE INDEX "blog_subscribers_confirm_token_idx" ON "blog_subscribers" USING btree ("confirm_token");--> statement-breakpoint
CREATE UNIQUE INDEX "blog_subscribers_unsubscribe_token_idx" ON "blog_subscribers" USING btree ("unsubscribe_token");--> statement-breakpoint
CREATE INDEX "blog_subscribers_status_idx" ON "blog_subscribers" USING btree ("status");