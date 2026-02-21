require 'rails_helper'

RSpec.describe 'Api::V1::Initiatives', type: :request do
  describe 'GET /api/v1/initiatives' do
    let!(:initiatives) { create_list(:initiative, 3) }

    it 'returns all initiatives' do
      get '/api/v1/initiatives'

      expect(response).to have_http_status(:ok)
      json = JSON.parse(response.body)
      expect(json.length).to eq(3)
    end

    it 'filters by status' do
      create(:initiative, :funded)

      get '/api/v1/initiatives', params: { status: 'open' }

      json = JSON.parse(response.body)
      expect(json.all? { |i| i['status'] == 'open' }).to be true
    end

    it 'searches by title' do
      garden = create(:initiative, title: 'Community Garden')

      get '/api/v1/initiatives', params: { search: 'garden' }

      json = JSON.parse(response.body)
      expect(json.any? { |i| i['id'] == garden.id }).to be true
    end

    it 'returns correct JSON structure' do
      get '/api/v1/initiatives'

      json = JSON.parse(response.body)
      initiative = json.first

      expect(initiative).to include(
        'id', 'title', 'description', 'goalAmount', 'heldAmount',
        'deadline', 'status', 'pledgeCount', 'location', 'organizer'
      )
    end
  end

  describe 'GET /api/v1/initiatives/:id' do
    let(:initiative) { create(:initiative) }

    it 'returns the initiative' do
      get "/api/v1/initiatives/#{initiative.id}"

      expect(response).to have_http_status(:ok)
      json = JSON.parse(response.body)
      expect(json['id']).to eq(initiative.id)
    end

    it 'includes updates and pledgers' do
      create(:pledge, initiative: initiative)

      get "/api/v1/initiatives/#{initiative.id}"

      json = JSON.parse(response.body)
      expect(json).to include('updates', 'pledgers')
    end

    it 'returns 404 for non-existent initiative' do
      get '/api/v1/initiatives/non-existent-id'

      expect(response).to have_http_status(:not_found)
    end
  end

  describe 'POST /api/v1/initiatives' do
    let(:valid_params) do
      {
        initiative: {
          title: 'New Initiative',
          description: 'A great new project',
          goal_amount: 5000,
          deadline: 5.days.from_now.iso8601,
          address: '123 Main St',
          latitude: 51.5074,
          longitude: -0.1278,
          visibility: 'public'
        }
      }
    end

    it 'creates a new initiative' do
      expect {
        post '/api/v1/initiatives', params: valid_params
      }.to change(Initiative, :count).by(1)

      expect(response).to have_http_status(:created)
    end

    it 'returns the created initiative' do
      post '/api/v1/initiatives', params: valid_params

      json = JSON.parse(response.body)
      expect(json['title']).to eq('New Initiative')
    end

    it 'returns errors for invalid params' do
      post '/api/v1/initiatives', params: { initiative: { title: '' } }

      expect(response).to have_http_status(:unprocessable_entity)
      json = JSON.parse(response.body)
      expect(json['errors']).to be_present
    end
  end
end
