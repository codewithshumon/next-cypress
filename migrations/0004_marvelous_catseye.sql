ALTER TABLE "files" RENAME COLUMN "text" TO "title";--> statement-breakpoint
ALTER TABLE "workspaces" ALTER COLUMN "created_at" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "workspaces" ALTER COLUMN "created_at" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "folders" DROP COLUMN IF EXISTS "logo";