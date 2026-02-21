FactoryBot.define do
  factory :initiative do
    title { Faker::Lorem.sentence(word_count: 4) }
    description { Faker::Lorem.paragraph(sentence_count: 3) }
    goal_amount { Faker::Number.between(from: 1000, to: 10000) }
    held_amount { 0 }
    deadline { 3.days.from_now }
    status { 'open' }
    visibility { 'public' }
    address { Faker::Address.full_address }
    latitude { Faker::Address.latitude }
    longitude { Faker::Address.longitude }
    community { Faker::Company.name }
    association :organizer, factory: :user

    trait :funded do
      status { 'funded' }
      held_amount { goal_amount }
    end

    trait :failed do
      status { 'failed' }
      deadline { 1.day.ago }
    end

    trait :private do
      visibility { 'private' }
    end
  end
end
