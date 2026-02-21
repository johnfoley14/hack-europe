class Initiative < ApplicationRecord
  belongs_to :organizer, class_name: 'User'
  has_many :pledges, dependent: :destroy
  has_many :pledgers, through: :pledges, source: :user
  has_many :updates, dependent: :destroy

  enum :status, { open: 'open', funded: 'funded', failed: 'failed', canceled: 'canceled' }
  enum :visibility, { public_visibility: 'public', private_visibility: 'private' }

  validates :title, presence: true
  validates :description, presence: true
  validates :goal_amount, presence: true, numericality: { greater_than: 0 }
  validates :deadline, presence: true
  validates :address, presence: true

  before_create :generate_invite_token, if: :private_visibility?
  after_save :check_funding_status, if: :open?
  after_save :capture_pledges_if_funded

  scope :active, -> { where(status: 'open').where('deadline > ?', Time.current) }
  scope :by_status, ->(status) { where(status: status) if status.present? }
  scope :search, ->(query) {
    where('title ILIKE ? OR description ILIKE ?', "%#{query}%", "%#{query}%") if query.present?
  }

  def pledge_count
    pledges.count
  end

  def progress_percentage
    return 0 if goal_amount.zero?
    [(held_amount / goal_amount * 100).round, 100].min
  end

  def time_remaining
    return 0 if deadline < Time.current
    deadline - Time.current
  end

  def ending_soon?
    open? && time_remaining > 0 && time_remaining < 24.hours
  end

  private

  def generate_invite_token
    self.invite_token = SecureRandom.urlsafe_base64(8)
  end

  def check_funding_status
    if held_amount >= goal_amount
      update_column(:status, 'funded')
    end
  end

  def capture_pledges_if_funded
    if saved_change_to_status? && status == 'funded'
      PledgeCaptureService.capture_all(self)
    end
  end
end
