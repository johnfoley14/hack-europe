module Api
  module V1
    module Initiatives
      class PledgesController < BaseController
        def create
          @initiative = Initiative.find(params[:initiative_id])
          @pledge = @initiative.pledges.build(pledge_params)
          @pledge.user = current_user || create_pledge_user

          if @pledge.save
            render json: {
              id: @pledge.id,
              amount: @pledge.amount.to_f,
              status: @pledge.status,
              initiative: {
                id: @initiative.id,
                heldAmount: @initiative.reload.held_amount.to_f,
                status: @initiative.status
              }
            }, status: :created
          else
            render json: { errors: @pledge.errors.full_messages }, status: :unprocessable_entity
          end
        end

        private

        def pledge_params
          params.require(:pledge).permit(:amount)
        end

        def create_pledge_user
          User.create!(
            name: params[:name] || "Anonymous Pledger",
            email: params[:email] || "pledger_#{SecureRandom.hex(8)}@tidepool.local"
          )
        end
      end
    end
  end
end
