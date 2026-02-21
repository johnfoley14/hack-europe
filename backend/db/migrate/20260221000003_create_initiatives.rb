class CreateInitiatives < ActiveRecord::Migration[8.1]
  def change
    create_table :initiatives, id: :uuid do |t|
      t.string :title, null: false
      t.text :description, null: false
      t.decimal :goal_amount, precision: 10, scale: 2, null: false
      t.decimal :held_amount, precision: 10, scale: 2, default: 0.0
      t.datetime :deadline, null: false
      t.string :status, default: 'open'
      t.string :visibility, default: 'public'
      t.string :invite_token
      t.string :address, null: false
      t.decimal :latitude, precision: 10, scale: 7
      t.decimal :longitude, precision: 10, scale: 7
      t.string :community
      t.references :organizer, type: :uuid, foreign_key: { to_table: :users }, null: false
      t.timestamps
    end

    add_index :initiatives, :status
    add_index :initiatives, :visibility
    add_index :initiatives, :invite_token, unique: true
    add_index :initiatives, :deadline
  end
end
