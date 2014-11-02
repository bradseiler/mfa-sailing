CREATE TABLE "finishes" ("id" INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, "sailor_race_day_id" integer NOT NULL, "race_id" integer NOT NULL, "score" varchar(255) NOT NULL, "created_at" datetime NOT NULL, "updated_at" datetime NOT NULL);
CREATE TABLE "race_days" ("id" INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, "season" varchar(255) NOT NULL, "regatta_id" integer, "date" date NOT NULL, "created_at" datetime NOT NULL, "updated_at" datetime NOT NULL);
CREATE TABLE "races" ("id" INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, "race_day_id" integer NOT NULL, "division" varchar(255) NOT NULL, "sailors_starting" integer NOT NULL, "start_number" integer NOT NULL, "created_at" datetime NOT NULL, "updated_at" datetime NOT NULL);
CREATE TABLE "rc_credits" ("id" INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, "race_day_id" integer NOT NULL, "sailor_id" integer NOT NULL, "created_at" datetime NOT NULL, "updated_at" datetime NOT NULL);
CREATE TABLE "regatta" ("id" INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, "season" integer NOT NULL, "name" varchar(255) NOT NULL, "created_at" datetime NOT NULL, "updated_at" datetime NOT NULL);
CREATE TABLE "sailor_race_days" ("id" INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, "sailor_id" integer NOT NULL, "race_day_id" integer NOT NULL, "division" varchar(255) NOT NULL, "override_next_division" varchar(255), "created_at" datetime NOT NULL, "updated_at" datetime NOT NULL);
CREATE TABLE "sailors" ("id" INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, "first_name" varchar(255) NOT NULL, "last_name" varchar(255) NOT NULL, "email" varchar(255), "large_sail" integer, "small_sail" integer, "active" boolean DEFAULT 't', "created_at" datetime NOT NULL, "updated_at" datetime NOT NULL);
CREATE TABLE "schema_migrations" ("version" varchar(255) NOT NULL);
CREATE TABLE "starting_divisions" ("id" INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, "sailor_id" integer NOT NULL, "season" integer NOT NULL, "division" varchar(255) NOT NULL, "created_at" datetime NOT NULL, "updated_at" datetime NOT NULL);
CREATE INDEX "index_finishes_on_race_id" ON "finishes" ("race_id");
CREATE INDEX "index_finishes_on_sailor_race_day_id" ON "finishes" ("sailor_race_day_id");
CREATE INDEX "index_race_days_on_regatta_id" ON "race_days" ("regatta_id");
CREATE INDEX "index_races_on_race_day_id" ON "races" ("race_day_id");
CREATE INDEX "index_rc_credits_on_race_day_id" ON "rc_credits" ("race_day_id");
CREATE INDEX "index_rc_credits_on_sailor_id" ON "rc_credits" ("sailor_id");
CREATE INDEX "index_sailor_race_days_on_race_day_id" ON "sailor_race_days" ("race_day_id");
CREATE INDEX "index_sailor_race_days_on_sailor_id" ON "sailor_race_days" ("sailor_id");
CREATE INDEX "index_starting_divisions_on_sailor_id" ON "starting_divisions" ("sailor_id");
CREATE UNIQUE INDEX "unique_schema_migrations" ON "schema_migrations" ("version");
INSERT INTO schema_migrations (version) VALUES ('20141102152151');

INSERT INTO schema_migrations (version) VALUES ('20141102152201');

INSERT INTO schema_migrations (version) VALUES ('20141102152226');

INSERT INTO schema_migrations (version) VALUES ('20141102152235');

INSERT INTO schema_migrations (version) VALUES ('20141102152252');

INSERT INTO schema_migrations (version) VALUES ('20141102152438');

INSERT INTO schema_migrations (version) VALUES ('20141102152937');

INSERT INTO schema_migrations (version) VALUES ('20141102153151');

