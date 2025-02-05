CREATE EXTENSION IF NOT EXISTS unaccent;

-- create the function in the public schema
CREATE OR REPLACE FUNCTION public.slugify(
  v TEXT
) RETURNS TEXT
  LANGUAGE plpgsql
  STRICT IMMUTABLE AS
$function$
BEGIN
  -- 1. trim trailing and leading whitespaces from text
  -- 2. remove accents (diacritic signs) from a given text
  -- 3. lowercase unaccented text
  -- 4. replace non-alphanumeric (excluding hyphen, underscore) with a hyphen
  -- 5. trim leading and trailing hyphens
  RETURN trim(BOTH '-' FROM regexp_replace(lower(unaccent(trim(v))), '[^a-z0-9\\-_]+', '-', 'gi'));
END;
$function$;
CREATE TYPE "public"."condition" AS ENUM('mint', 'near_mint', 'lightly_played', 'played', 'heavily_played', 'poor');--> statement-breakpoint
CREATE TABLE "account" (
	"userId" text NOT NULL,
	"type" text NOT NULL,
	"provider" text NOT NULL,
	"providerAccountId" text NOT NULL,
	"refresh_token" text,
	"access_token" text,
	"expires_at" integer,
	"token_type" text,
	"scope" text,
	"id_token" text,
	"session_state" text
);
--> statement-breakpoint
CREATE TABLE "authenticator" (
	"credentialID" text NOT NULL,
	"userId" text NOT NULL,
	"providerAccountId" text NOT NULL,
	"credentialPublicKey" text NOT NULL,
	"counter" integer NOT NULL,
	"credentialDeviceType" text NOT NULL,
	"credentialBackedUp" boolean NOT NULL,
	"transports" text,
	CONSTRAINT "authenticator_credentialID_unique" UNIQUE("credentialID")
);
--> statement-breakpoint
CREATE TABLE "cards" (
	"id" text PRIMARY KEY NOT NULL,
	"tcg_id" integer,
	"set_id" varchar,
	"name" varchar(255) NOT NULL,
	"search_name" varchar(255) NOT NULL,
	"tcg_api_id" text,
	"number" varchar(20),
	"rarity" varchar(20),
	"metadata" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"images" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"slug" text GENERATED ALWAYS AS (slugify("cards"."search_name")) STORED
);
--> statement-breakpoint
CREATE TABLE "listings" (
	"id" text PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"card_id" text,
	"list_id" text NOT NULL,
	"condition" "condition" DEFAULT 'near_mint',
	"price" numeric(12, 2) NOT NULL,
	"quantity" integer DEFAULT 1,
	"is_reverse" boolean DEFAULT false,
	"is_signed" boolean DEFAULT false,
	"is_first_edition" boolean DEFAULT false,
	"is_altered" boolean DEFAULT false,
	"language" varchar(20) DEFAULT 'English',
	"notes" text,
	"image" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "session" (
	"sessionToken" text PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"expires" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sets" (
	"id" varchar(20) PRIMARY KEY NOT NULL,
	"tcg_id" integer,
	"name" varchar(100) NOT NULL,
	"series" varchar(50) NOT NULL,
	"printed_total" integer,
	"total" integer,
	"ptcgo_code" varchar(20),
	"release_date" timestamp,
	"logo_url" text,
	"symbol_url" text,
	"created_at" timestamp DEFAULT now(),
	"slug" text GENERATED ALWAYS AS (slugify("sets"."name")) STORED
);
--> statement-breakpoint
CREATE TABLE "tcgs" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(50) NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"slug" text GENERATED ALWAYS AS (slugify("tcgs"."name")) STORED,
	CONSTRAINT "tcgs_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "user_lists" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"name" varchar(100) NOT NULL,
	"is_public" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text,
	"email" text,
	"emailVerified" timestamp,
	"image" text,
	CONSTRAINT "user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "verificationToken" (
	"identifier" text NOT NULL,
	"token" text NOT NULL,
	"expires" timestamp NOT NULL
);
--> statement-breakpoint
ALTER TABLE "account" ADD CONSTRAINT "account_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "authenticator" ADD CONSTRAINT "authenticator_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cards" ADD CONSTRAINT "cards_tcg_id_tcgs_id_fk" FOREIGN KEY ("tcg_id") REFERENCES "public"."tcgs"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cards" ADD CONSTRAINT "cards_set_id_sets_id_fk" FOREIGN KEY ("set_id") REFERENCES "public"."sets"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "listings" ADD CONSTRAINT "listings_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "listings" ADD CONSTRAINT "listings_card_id_cards_id_fk" FOREIGN KEY ("card_id") REFERENCES "public"."cards"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "listings" ADD CONSTRAINT "listings_list_id_user_lists_id_fk" FOREIGN KEY ("list_id") REFERENCES "public"."user_lists"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session" ADD CONSTRAINT "session_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sets" ADD CONSTRAINT "sets_tcg_id_tcgs_id_fk" FOREIGN KEY ("tcg_id") REFERENCES "public"."tcgs"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_lists" ADD CONSTRAINT "user_lists_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "name_search_index" ON "cards" USING gin (to_tsvector('english', "name"));
