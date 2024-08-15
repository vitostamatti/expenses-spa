CREATE TABLE IF NOT EXISTS "expense" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"title" text NOT NULL,
	"amount" numeric(12, 2) NOT NULL
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "user_id_idx" ON "expense" USING btree ("user_id");