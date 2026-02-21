class CreateUpdates < ActiveRecord::Migration[8.1]
  def change
    create_table :updates, id: :uuid do |t|
      t.references :initiative, type: :uuid, foreign_key: true, null: false
      t.text :text, null: false
      t.timestamps
    end
  end
end
