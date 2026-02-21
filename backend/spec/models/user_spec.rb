require 'rails_helper'

RSpec.describe User, type: :model do
  describe 'validations' do
    subject { build(:user) }

    it { is_expected.to validate_presence_of(:name) }
    it { is_expected.to validate_presence_of(:email) }
    it { is_expected.to validate_uniqueness_of(:email).case_insensitive }
  end

  describe 'associations' do
    it { is_expected.to have_many(:initiatives).with_foreign_key(:organizer_id) }
    it { is_expected.to have_many(:pledges) }
  end

  describe 'email normalization' do
    it 'downcases email before saving' do
      user = create(:user, email: 'TEST@EXAMPLE.COM')
      expect(user.email).to eq('test@example.com')
    end
  end
end
