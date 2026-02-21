# Clear existing data
puts "Clearing existing data..."
Update.destroy_all
Pledge.destroy_all
Initiative.destroy_all
User.destroy_all

puts "Creating users..."
users = [
  User.create!(name: 'Sarah Chen', email: 'sarah@example.com'),
  User.create!(name: 'David Park', email: 'david@example.com'),
  User.create!(name: 'Mika Jones', email: 'mika@example.com'),
  User.create!(name: 'Rachel Green', email: 'rachel@example.com'),
  User.create!(name: 'Emma White', email: 'emma@example.com'),
  User.create!(name: "Ciarán O'Brien", email: 'ciaran@example.com'),
  User.create!(name: 'Niamh Gallagher', email: 'niamh@example.com'),
  User.create!(name: 'Declan Murphy', email: 'declan@example.com')
]

pledgers = [
  User.create!(name: 'James W.', email: 'james@example.com'),
  User.create!(name: 'Maria L.', email: 'maria@example.com'),
  User.create!(name: 'Tom R.', email: 'tom@example.com'),
  User.create!(name: 'Lisa K.', email: 'lisa@example.com'),
  User.create!(name: 'Anna B.', email: 'anna@example.com'),
  User.create!(name: 'Chris M.', email: 'chris@example.com')
]

puts "Creating initiatives..."

# Initiative 1 - Open, ending soon
i1 = Initiative.create!(
  title: 'Community Garden Renovation',
  description: 'Transform the abandoned lot on Elm Street into a vibrant community garden with raised beds, composting stations, and a small greenhouse. This project will bring fresh produce to our neighborhood and create a gathering space for all ages.',
  goal_amount: 5000,
  held_amount: 3750,
  deadline: 3.days.from_now,
  address: 'Elm Street, London',
  latitude: 51.5074,
  longitude: -0.1278,
  community: 'Green London',
  organizer: users[0],
  status: 'open'
)

Update.create!(initiative: i1, text: "We've secured the land permit! Moving forward with the design phase.")
Update.create!(initiative: i1, text: "Initial community meeting held. 40+ attendees excited about the project!")

# Initiative 2 - Funded
i2 = Initiative.create!(
  title: 'Youth Coding Workshop',
  description: 'Fund a week-long intensive coding workshop for underserved youth ages 12-18. Includes laptops, curriculum materials, and instructor fees.',
  goal_amount: 3000,
  held_amount: 3000,
  deadline: 2.hours.ago,
  address: 'Community Center, Manchester',
  latitude: 53.4808,
  longitude: -2.2426,
  community: 'TechForAll',
  organizer: users[1],
  status: 'funded'
)

Update.create!(initiative: i2, text: "🎉 We did it! Goal reached! Workshop dates will be announced soon.")

# Initiative 3 - Failed
i3 = Initiative.create!(
  title: 'Street Art Festival',
  description: 'Organize a weekend street art festival featuring 15 local artists. Funds cover supplies, permits, and artist stipends.',
  goal_amount: 8000,
  held_amount: 1200,
  deadline: 1.hour.ago,
  address: 'Brick Lane, London',
  latitude: 51.5215,
  longitude: -0.0722,
  community: 'Art Collective',
  organizer: users[2],
  status: 'failed'
)

# Initiative 4 - Open, ending very soon
i4 = Initiative.create!(
  title: 'Dog Park Cleanup Drive',
  description: "Hire professional cleaners and purchase new waste stations for the Riverside Dog Park. Keep our furry friends' space safe and clean.",
  goal_amount: 1500,
  held_amount: 800,
  deadline: 18.hours.from_now,
  address: 'Riverside Park, Bristol',
  latitude: 51.4545,
  longitude: -2.5879,
  community: 'Bristol Pet Lovers',
  organizer: users[3],
  status: 'open'
)

Update.create!(initiative: i4, text: "Cleanup crew booked for next Saturday!")

# Initiative 5 - Open, plenty of time
i5 = Initiative.create!(
  title: 'Mobile Library for Rural Areas',
  description: 'Purchase and outfit a van as a mobile library serving three rural communities with limited access to books and educational resources.',
  goal_amount: 12000,
  held_amount: 4500,
  deadline: 5.days.from_now,
  address: 'Cotswolds, Gloucestershire',
  latitude: 51.8330,
  longitude: -1.8433,
  community: 'Rural Reads',
  organizer: users[4],
  status: 'open'
)

Update.create!(initiative: i5, text: "Found a great van candidate! Negotiating price.")

# Initiative 6 - Dublin Busking Stage
i6 = Initiative.create!(
  title: 'Temple Bar Busking Stage',
  description: "Build a permanent covered busking stage in Temple Bar to support Dublin's street musicians. Includes weather protection, basic sound equipment, and scheduled performance slots.",
  goal_amount: 7500,
  held_amount: 2800,
  deadline: 4.days.from_now,
  address: 'Temple Bar, Dublin',
  latitude: 53.3457,
  longitude: -6.2643,
  community: 'Dublin Arts',
  organizer: users[5],
  status: 'open'
)

Update.create!(initiative: i6, text: "Dublin City Council gave preliminary approval for the location!")

# Initiative 7 - Phoenix Park Wildflower (Funded)
i7 = Initiative.create!(
  title: 'Phoenix Park Wildflower Meadow',
  description: 'Transform a section of Phoenix Park into a native wildflower meadow to support pollinators and biodiversity. Includes seed sourcing, soil prep, and interpretive signage.',
  goal_amount: 4000,
  held_amount: 4000,
  deadline: 5.hours.ago,
  address: 'Phoenix Park, Dublin',
  latitude: 53.3558,
  longitude: -6.3298,
  community: 'Green Dublin',
  organizer: users[6],
  status: 'funded'
)

Update.create!(initiative: i7, text: "🎉 Fully funded! Planting begins next month.")

# Initiative 8 - Dublin Swim Club
i8 = Initiative.create!(
  title: 'Docklands Youth Swim Club',
  description: 'Fund swimming lessons and pool access for 50 young people in the Dublin Docklands area who currently have no affordable access to learn to swim.',
  goal_amount: 3500,
  held_amount: 1100,
  deadline: 2.days.from_now,
  address: 'Grand Canal Dock, Dublin',
  latitude: 53.3389,
  longitude: -6.2285,
  community: 'Docklands Community',
  organizer: users[7],
  status: 'open'
)

Update.create!(initiative: i8, text: "Partnered with a local pool for discounted rates!")

puts "Seeded #{User.count} users and #{Initiative.count} initiatives"
puts "Created #{Pledge.count} pledges and #{Update.count} updates"
