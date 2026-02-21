Rails.application.routes.draw do
  namespace :api do
    namespace :v1 do
      resources :payment_intents, only: [ :create ]
      resources :initiatives, only: [ :index, :show, :create ] do
        resources :pledges, only: [ :create ], module: :initiatives
      end
    end
  end

  # Health check endpoint
  get "up" => "rails/health#show", as: :rails_health_check
  get "/health", to: proc { [ 200, {}, [ "OK" ] ] }
end
