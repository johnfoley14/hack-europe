FactoryBot.define do
  factory :pledge do
    amount { Faker::Number.between(from: 10, to: 500) }
    status { 'held' }
    association :initiative
    association :user
  end
end
