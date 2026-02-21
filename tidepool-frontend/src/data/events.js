const now = new Date();
const minsAgo = (m) => new Date(now.getTime() - m * 60 * 1000).toISOString();
const hoursAgo = (h) => minsAgo(h * 60);

export const adminEvents = [
  { id: 'evt_1', type: 'pledge_authorized', message: 'New pledge of \u00A3100.00 authorized on "Damp Survey & Legal Action"', timestamp: minsAgo(3) },
  { id: 'evt_2', type: 'initiative_funded', message: '"Emergency Heating Fund" reached its goal — capturing pledges', timestamp: minsAgo(15) },
  { id: 'evt_3', type: 'pledge_captured', message: '67 pledges captured for "Emergency Heating Fund" (\u00A31,800.00 total)', timestamp: minsAgo(16) },
  { id: 'evt_4', type: 'pledge_authorized', message: 'New pledge of \u00A350.00 authorized on "Clean Water for Elmsworth"', timestamp: minsAgo(42) },
  { id: 'evt_5', type: 'pledge_canceled', message: 'Pledge of \u00A325.00 canceled on "Bike Lane — Stokes Croft"', timestamp: hoursAgo(1.5) },
  { id: 'evt_6', type: 'initiative_failed', message: '"Playground Restoration" deadline passed — releasing 12 holds', timestamp: hoursAgo(3) },
  { id: 'evt_7', type: 'pledge_authorized', message: 'New pledge of \u00A3200.00 authorized on "Roof Repair Emergency"', timestamp: hoursAgo(4) },
  { id: 'evt_8', type: 'initiative_created', message: 'New initiative created: "Community Garden Greenhouse"', timestamp: hoursAgo(6) },
  { id: 'evt_9', type: 'pledge_captured', message: '54 pledges captured for "Cargo Bike Sharing Scheme" (\u00A36,800.00 total)', timestamp: hoursAgo(8) },
  { id: 'evt_10', type: 'pledge_authorized', message: 'New pledge of \u00A375.00 authorized on "Legal Fund — Rent Challenge"', timestamp: hoursAgo(10) },
];
