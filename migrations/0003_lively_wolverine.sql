CREATE TABLE "security_events" (
	"id" serial PRIMARY KEY NOT NULL,
	"ts" timestamp DEFAULT now() NOT NULL,
	"ip" varchar(45) NOT NULL,
	"country" varchar(2),
	"city" varchar(128),
	"asn" varchar(32),
	"method" varchar(10) NOT NULL,
	"path" varchar(512) NOT NULL,
	"status" integer NOT NULL,
	"ua" text,
	"referer" text,
	"tag" varchar(16) NOT NULL
);
--> statement-breakpoint
CREATE INDEX "security_events_ts_idx" ON "security_events" USING btree ("ts");--> statement-breakpoint
CREATE INDEX "security_events_ip_idx" ON "security_events" USING btree ("ip");--> statement-breakpoint
CREATE INDEX "security_events_tag_idx" ON "security_events" USING btree ("tag");