class User < ApplicationRecord
  has_secure_password validations: false

  has_many :initiatives, foreign_key: :organizer_id, dependent: :destroy
  has_many :pledges, dependent: :destroy
  has_many :pledged_initiatives, through: :pledges, source: :initiative

  validates :name, presence: true
  validates :email, presence: true, uniqueness: { case_sensitive: false },
                    format: { with: URI::MailTo::EMAIL_REGEXP }

  before_save :downcase_email

  private

  def downcase_email
    self.email = email.downcase
  end
end
