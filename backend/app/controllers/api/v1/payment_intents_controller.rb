module Api
  module V1
    class PaymentIntentsController < BaseController
      def create
        amount_cents = (params[:amount].to_f * 100).to_i

        payment_intent = Stripe::PaymentIntent.create(
          amount: amount_cents,
          currency: "eur",
          capture_method: "manual",
          metadata: { initiative_id: params[:initiative_id] }
        )

        render json: { clientSecret: payment_intent.client_secret }
      rescue Stripe::StripeError => e
        render json: { error: e.message }, status: :unprocessable_entity
      end
    end
  end
end
