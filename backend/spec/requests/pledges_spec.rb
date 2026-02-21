require 'rails_helper'

RSpec.describe 'Api::V1::Initiatives::Pledges', type: :request do
  let(:initiative) { create(:initiative, goal_amount: 1000) }

  describe 'POST /api/v1/initiatives/:initiative_id/pledges' do
    let(:valid_params) do
      {
        pledge: { amount: 50 },
        name: 'John Doe',
        email: 'john@example.com'
      }
    end

    it 'creates a pledge' do
      expect {
        post "/api/v1/initiatives/#{initiative.id}/pledges", params: valid_params
      }.to change(Pledge, :count).by(1)

      expect(response).to have_http_status(:created)
    end

    it 'updates initiative held amount' do
      post "/api/v1/initiatives/#{initiative.id}/pledges", params: valid_params

      expect(initiative.reload.held_amount).to eq(50)
    end

    it 'returns pledge details and updated initiative' do
      post "/api/v1/initiatives/#{initiative.id}/pledges", params: valid_params

      json = JSON.parse(response.body)
      expect(json['amount']).to eq(50)
      expect(json['initiative']['heldAmount']).to eq(50)
    end

    it 'rejects pledges for non-open initiatives' do
      funded_initiative = create(:initiative, :funded)

      post "/api/v1/initiatives/#{funded_initiative.id}/pledges", params: valid_params

      expect(response).to have_http_status(:unprocessable_entity)
    end

    it 'marks initiative as funded when goal is reached' do
      # Create actual pledges totaling 950 (held_amount is calculated from pledges)
      create(:pledge, initiative: initiative, amount: 950)

      post "/api/v1/initiatives/#{initiative.id}/pledges", params: valid_params

      expect(initiative.reload.status).to eq('funded')
    end
  end
end
