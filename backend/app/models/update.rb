class Update < ApplicationRecord
  belongs_to :initiative

  validates :text, presence: true

  default_scope { order(created_at: :desc) }
end
