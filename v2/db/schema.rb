# encoding: UTF-8
# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 20141102153151) do

  create_table "finishes", force: true do |t|
    t.integer  "sailor_race_day_id", null: false
    t.integer  "race_id",            null: false
    t.string   "score",              null: false
    t.datetime "created_at",         null: false
    t.datetime "updated_at",         null: false
  end

  add_index "finishes", ["race_id"], name: "index_finishes_on_race_id"
  add_index "finishes", ["sailor_race_day_id"], name: "index_finishes_on_sailor_race_day_id"

  create_table "race_days", force: true do |t|
    t.string   "season",     null: false
    t.integer  "regatta_id"
    t.date     "date",       null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  add_index "race_days", ["regatta_id"], name: "index_race_days_on_regatta_id"

  create_table "races", force: true do |t|
    t.integer  "race_day_id",      null: false
    t.string   "division",         null: false
    t.integer  "sailors_starting", null: false
    t.integer  "start_number",     null: false
    t.datetime "created_at",       null: false
    t.datetime "updated_at",       null: false
  end

  add_index "races", ["race_day_id"], name: "index_races_on_race_day_id"

  create_table "rc_credits", force: true do |t|
    t.integer  "race_day_id", null: false
    t.integer  "sailor_id",   null: false
    t.datetime "created_at",  null: false
    t.datetime "updated_at",  null: false
  end

  add_index "rc_credits", ["race_day_id"], name: "index_rc_credits_on_race_day_id"
  add_index "rc_credits", ["sailor_id"], name: "index_rc_credits_on_sailor_id"

  create_table "regatta", force: true do |t|
    t.integer  "season",     null: false
    t.string   "name",       null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "sailor_race_days", force: true do |t|
    t.integer  "sailor_id",              null: false
    t.integer  "race_day_id",            null: false
    t.string   "division",               null: false
    t.string   "override_next_division"
    t.datetime "created_at",             null: false
    t.datetime "updated_at",             null: false
  end

  add_index "sailor_race_days", ["race_day_id"], name: "index_sailor_race_days_on_race_day_id"
  add_index "sailor_race_days", ["sailor_id"], name: "index_sailor_race_days_on_sailor_id"

  create_table "sailors", force: true do |t|
    t.string   "first_name",                null: false
    t.string   "last_name",                 null: false
    t.string   "email"
    t.integer  "large_sail"
    t.integer  "small_sail"
    t.boolean  "active",     default: true
    t.datetime "created_at",                null: false
    t.datetime "updated_at",                null: false
  end

  create_table "starting_divisions", force: true do |t|
    t.integer  "sailor_id",  null: false
    t.integer  "season",     null: false
    t.string   "division",   null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  add_index "starting_divisions", ["sailor_id"], name: "index_starting_divisions_on_sailor_id"

end
