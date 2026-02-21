# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[8.1].define(version: 2026_02_21_000006) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "pg_catalog.plpgsql"
  enable_extension "pgcrypto"

  create_table "initiatives", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.string "address", null: false
    t.string "community"
    t.datetime "created_at", null: false
    t.datetime "deadline", null: false
    t.text "description", null: false
    t.decimal "goal_amount", precision: 10, scale: 2, null: false
    t.decimal "held_amount", precision: 10, scale: 2, default: "0.0"
    t.string "invite_token"
    t.decimal "latitude", precision: 10, scale: 7
    t.decimal "longitude", precision: 10, scale: 7
    t.uuid "organizer_id", null: false
    t.string "status", default: "open"
    t.string "title", null: false
    t.datetime "updated_at", null: false
    t.string "visibility", default: "public"
    t.index ["deadline"], name: "index_initiatives_on_deadline"
    t.index ["invite_token"], name: "index_initiatives_on_invite_token", unique: true
    t.index ["organizer_id"], name: "index_initiatives_on_organizer_id"
    t.index ["status"], name: "index_initiatives_on_status"
    t.index ["visibility"], name: "index_initiatives_on_visibility"
  end

  create_table "pledges", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.decimal "amount", precision: 10, scale: 2, null: false
    t.datetime "created_at", null: false
    t.uuid "initiative_id", null: false
    t.string "status", default: "held"
    t.string "stripe_payment_intent_id"
    t.datetime "updated_at", null: false
    t.uuid "user_id", null: false
    t.index ["initiative_id", "user_id"], name: "index_pledges_on_initiative_id_and_user_id"
    t.index ["initiative_id"], name: "index_pledges_on_initiative_id"
    t.index ["stripe_payment_intent_id"], name: "index_pledges_on_stripe_payment_intent_id", unique: true
    t.index ["user_id"], name: "index_pledges_on_user_id"
  end

  create_table "updates", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.datetime "created_at", null: false
    t.uuid "initiative_id", null: false
    t.text "text", null: false
    t.datetime "updated_at", null: false
    t.index ["initiative_id"], name: "index_updates_on_initiative_id"
  end

  create_table "users", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.string "avatar_url"
    t.datetime "created_at", null: false
    t.string "email", null: false
    t.string "name", null: false
    t.string "password_digest"
    t.datetime "updated_at", null: false
    t.index ["email"], name: "index_users_on_email", unique: true
  end

  add_foreign_key "initiatives", "users", column: "organizer_id"
  add_foreign_key "pledges", "initiatives"
  add_foreign_key "pledges", "users"
  add_foreign_key "updates", "initiatives"
end
