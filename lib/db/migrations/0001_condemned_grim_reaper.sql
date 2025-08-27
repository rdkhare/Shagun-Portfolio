ALTER TABLE "articles" ALTER COLUMN "content" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "articles" ADD COLUMN "external_url" text;--> statement-breakpoint
ALTER TABLE "articles" ADD COLUMN "publisher" text;--> statement-breakpoint
ALTER TABLE "articles" ADD COLUMN "category" text;