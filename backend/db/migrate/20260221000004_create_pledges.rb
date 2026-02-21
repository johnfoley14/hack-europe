class CreatePledges < ActiveRecord::Migration[8.1]
  def change
    create_table :pledges, id: :uuid do |t|
      t.references :initiative, type: :uuid, foreign_key: true, null: false
      t.references :user, type: :uuid, foreign_key: true, null: false
      t.decimal :amount, precision: 10, scale: 2, null: false
      t.string :status, default: 'held'
      t.timestamps
    end

    add_index :pledges, [:initiative_id, :user_id]
  end
end
