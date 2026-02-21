require 'rails_helper'

RSpec.describe Initiative, type: :model do
  describe 'validations' do
    subject { build(:initiative) }

    it { is_expected.to validate_presence_of(:title) }
    it { is_expected.to validate_presence_of(:description) }
    it { is_expected.to validate_presence_of(:goal_amount) }
    it { is_expected.to validate_presence_of(:deadline) }
    it { is_expected.to validate_presence_of(:address) }
    it { is_expected.to validate_numericality_of(:goal_amount).is_greater_than(0) }
  end

  describe 'associations' do
    it { is_expected.to belong_to(:organizer).class_name('User') }
    it { is_expected.to have_many(:pledges) }
    it { is_expected.to have_many(:updates) }
  end

  describe 'scopes' do
    let!(:open_initiative) { create(:initiative, status: 'open') }
    let!(:funded_initiative) { create(:initiative, :funded) }
    let!(:failed_initiative) { create(:initiative, :failed) }

    describe '.by_status' do
      it 'filters by open status' do
        expect(Initiative.by_status('open')).to include(open_initiative)
        expect(Initiative.by_status('open')).not_to include(funded_initiative)
      end

      it 'returns all when status is nil' do
        expect(Initiative.by_status(nil)).to include(open_initiative, funded_initiative, failed_initiative)
      end
    end

    describe '.search' do
      let!(:garden_initiative) { create(:initiative, title: 'Community Garden') }
      let!(:park_initiative) { create(:initiative, title: 'Park Renovation') }

      it 'searches by title' do
        expect(Initiative.search('garden')).to include(garden_initiative)
        expect(Initiative.search('garden')).not_to include(park_initiative)
      end
    end
  end

  describe '#pledge_count' do
    let(:initiative) { create(:initiative) }

    it 'returns the number of pledges' do
      create_list(:pledge, 3, initiative: initiative)
      expect(initiative.pledge_count).to eq(3)
    end
  end

  describe '#progress_percentage' do
    it 'calculates percentage correctly' do
      initiative = create(:initiative, goal_amount: 1000, held_amount: 500)
      expect(initiative.progress_percentage).to eq(50)
    end

    it 'caps at 100%' do
      initiative = create(:initiative, goal_amount: 1000, held_amount: 1500)
      expect(initiative.progress_percentage).to eq(100)
    end
  end

  describe 'funding status' do
    it 'marks as funded when goal is reached' do
      initiative = create(:initiative, goal_amount: 100, held_amount: 0)
      initiative.update!(held_amount: 100)
      expect(initiative.reload.status).to eq('funded')
    end
  end
end
