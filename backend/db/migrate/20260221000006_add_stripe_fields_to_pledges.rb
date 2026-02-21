class AddStripeFieldsToPledges < ActiveRecord::Migration[8.0]
  def change
    add_column :pledges, :stripe_payment_intent_id, :string
    add_index :pledges, :stripe_payment_intent_id, unique: true
  end
end
