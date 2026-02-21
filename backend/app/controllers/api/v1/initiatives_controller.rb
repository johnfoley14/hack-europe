module Api
  module V1
    class InitiativesController < BaseController
      def index
        @initiatives = Initiative.includes(:organizer, :pledges, :updates)
        @initiatives = @initiatives.by_status(params[:status])
        @initiatives = @initiatives.search(params[:search])
        @initiatives = @initiatives.order(created_at: :desc)

        render json: @initiatives.map { |i| initiative_json(i) }
      end

      def show
        @initiative = Initiative.includes(:organizer, :pledges, :updates)
                               .find(params[:id])
        render json: initiative_json(@initiative, detailed: true)
      end

      def create
        @initiative = Initiative.new(initiative_params)
        @initiative.organizer = current_user || create_anonymous_user

        if @initiative.save
          render json: initiative_json(@initiative), status: :created
        else
          render json: { errors: @initiative.errors.full_messages }, status: :unprocessable_entity
        end
      end

      private

      def initiative_params
        params.require(:initiative).permit(
          :title, :description, :goal_amount, :deadline,
          :address, :latitude, :longitude, :visibility, :community
        )
      end

      def initiative_json(initiative, detailed: false)
        json = {
          id: initiative.id,
          title: initiative.title,
          description: initiative.description,
          goalAmount: initiative.goal_amount.to_f,
          heldAmount: initiative.held_amount.to_f,
          deadline: initiative.deadline.iso8601,
          status: initiative.status,
          visibility: initiative.visibility,
          community: initiative.community,
          pledgeCount: initiative.pledge_count,
          location: {
            address: initiative.address,
            lat: initiative.latitude.to_f,
            lng: initiative.longitude.to_f
          },
          organizer: {
            name: initiative.organizer.name,
            avatar: initiative.organizer.avatar_url
          },
          createdAt: initiative.created_at.iso8601,
          updatedAt: initiative.updated_at.iso8601
        }

        if detailed
          json[:updates] = initiative.updates.map do |update|
            { date: update.created_at.iso8601, text: update.text }
          end

          json[:pledgers] = initiative.pledges.includes(:user).limit(10).map do |pledge|
            {
              name: pledge.user.name,
              avatar: pledge.user.avatar_url,
              amount: pledge.amount.to_f
            }
          end
        end

        json
      end

      def create_anonymous_user
        User.create!(
          name: "Anonymous User",
          email: "anonymous_#{SecureRandom.hex(8)}@tidepool.local"
        )
      end
    end
  end
end
