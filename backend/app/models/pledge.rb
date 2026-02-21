class Pledge < ApplicationRecord
  belongs_to :initiative
  belongs_to :user

  enum :status, { held: 'held', charged: 'charged', refunded: 'refunded' }

  validates :amount, presence: true, numericality: { greater_than: 0 }
  validate :initiative_must_be_open, on: :create
  validate :amount_within_remaining, on: :create

  after_create :update_initiative_held_amount
  after_destroy :update_initiative_held_amount

  private

  def initiative_must_be_open
    errors.add(:initiative, 'is not accepting pledges') unless initiative&.open?
  end

  def amount_within_remaining
    return unless initiative
    remaining = initiative.goal_amount - initiative.held_amount
    if amount > remaining
      errors.add(:amount, "cannot exceed remaining amount of #{remaining}")
    end
  end

  def update_initiative_held_amount
    new_total = initiative.pledges.held.sum(:amount)
    initiative.update_column(:held_amount, new_total)
    initiative.send(:check_funding_status)
  end
end
