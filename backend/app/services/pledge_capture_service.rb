class PledgeCaptureService
  def self.capture_all(initiative)
    initiative.pledges.held.find_each do |pledge|
      next unless pledge.stripe_payment_intent_id

      Stripe::PaymentIntent.capture(pledge.stripe_payment_intent_id)
      pledge.update!(status: 'charged')
    rescue Stripe::StripeError => e
      Rails.logger.error "Failed to capture pledge #{pledge.id}: #{e.message}"
    end
  end
end
