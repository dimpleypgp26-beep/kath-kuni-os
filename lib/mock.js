export const ROOMS = [
  { name: "Birdsong",  property: "P1", category: "King Suite",  rate: 3200, capacity: 2 },
  { name: "Mudhouse",  property: "P1", category: "King Suite",  rate: 3200, capacity: 2 },
  { name: "Dorm 1",   property: "P1", category: "Dorm",        rate: 800,  capacity: 4 },
  { name: "Dorm 2",   property: "P1", category: "Dorm",        rate: 800,  capacity: 4 },
  { name: "Fairytale", property: "P2", category: "Queen Suite", rate: 2800, capacity: 2 },
  { name: "Moonlight", property: "P2", category: "Queen Suite", rate: 2800, capacity: 2 },
  { name: "Twin Room", property: "P2", category: "Twin Room",   rate: 2000, capacity: 2 },
  { name: "Dorm 3",   property: "P2", category: "Dorm",        rate: 800,  capacity: 4 },
];

// Generate deterministic demo bookings around today
function demoBookings() {
  const today = new Date();
  const d = (offsetDays) => {
    const dt = new Date(today);
    dt.setDate(dt.getDate() + offsetDays);
    return dt.toISOString().split("T")[0];
  };

  return [
    { id:"b1", guestName:"Arjun Mehta",    room:"Birdsong",  roomType:"King Suite",  nights:3, revenue:9600,  source:"Direct",       checkIn:d(-1), checkOut:d(2),  status:"confirmed", guestType:"couple",  city:"Delhi",     repeat:false, purpose:"leisure", property:"P1" },
    { id:"b2", guestName:"Priya Sharma",   room:"Mudhouse",  roomType:"King Suite",  nights:2, revenue:6400,  source:"MMT",          checkIn:d(0),  checkOut:d(2),  status:"confirmed", guestType:"couple",  city:"Mumbai",    repeat:true,  purpose:"leisure", property:"P1" },
    { id:"b3", guestName:"Rahul Verma",    room:"Fairytale", roomType:"Queen Suite", nights:4, revenue:11200, source:"Booking.com",  checkIn:d(-2), checkOut:d(2),  status:"confirmed", guestType:"couple",  city:"Bangalore", repeat:false, purpose:"leisure", property:"P2" },
    { id:"b4", guestName:"Sneha Kapoor",   room:"Twin Room", roomType:"Twin Room",   nights:1, revenue:2000,  source:"Direct",       checkIn:d(0),  checkOut:d(1),  status:"confirmed", guestType:"friends", city:"Chandigarh",repeat:false, purpose:"leisure", property:"P2" },
    { id:"b5", guestName:"Dorm Group A",   room:"Dorm 1",   roomType:"Dorm",        nights:2, revenue:1600,  source:"Hostelworld",  checkIn:d(-1), checkOut:d(1),  status:"confirmed", guestType:"solo",    city:"Pune",      repeat:false, purpose:"backpacking", property:"P1" },
    { id:"b6", guestName:"Vikram Singh",   room:"Moonlight", roomType:"Queen Suite", nights:3, revenue:8400,  source:"MMT",          checkIn:d(1),  checkOut:d(4),  status:"confirmed", guestType:"couple",  city:"Jaipur",    repeat:true,  purpose:"leisure", property:"P2" },
    { id:"b7", guestName:"Ananya Bose",    room:"Dorm 2",   roomType:"Dorm",        nights:2, revenue:1600,  source:"Walk-in",      checkIn:d(0),  checkOut:d(2),  status:"confirmed", guestType:"solo",    city:"Kolkata",   repeat:false, purpose:"leisure", property:"P1" },
    { id:"b8", guestName:"Rohan Gupta",    room:"Dorm 3",   roomType:"Dorm",        nights:5, revenue:4000,  source:"Direct",       checkIn:d(-3), checkOut:d(2),  status:"confirmed", guestType:"solo",    city:"Hyderabad", repeat:true,  purpose:"work",    property:"P2" },
    // past bookings for trends
    { id:"b9",  guestName:"Past Guest 1",  room:"Birdsong",  roomType:"King Suite",  nights:3, revenue:9600,  source:"Booking.com",  checkIn:d(-30),checkOut:d(-27),status:"confirmed", guestType:"couple",  city:"Delhi",     repeat:false, purpose:"leisure", property:"P1" },
    { id:"b10", guestName:"Past Guest 2",  room:"Fairytale", roomType:"Queen Suite", nights:2, revenue:5600,  source:"MMT",          checkIn:d(-25),checkOut:d(-23),status:"confirmed", guestType:"couple",  city:"Mumbai",    repeat:false, purpose:"leisure", property:"P2" },
    { id:"b11", guestName:"Past Guest 3",  room:"Moonlight", roomType:"Queen Suite", nights:4, revenue:11200, source:"Direct",       checkIn:d(-20),checkOut:d(-16),status:"confirmed", guestType:"friends", city:"Bangalore", repeat:false, purpose:"leisure", property:"P2" },
    { id:"b12", guestName:"Past Guest 4",  room:"Twin Room", roomType:"Twin Room",   nights:2, revenue:4000,  source:"Walk-in",      checkIn:d(-15),checkOut:d(-13),status:"confirmed", guestType:"couple",  city:"Chandigarh",repeat:false, purpose:"leisure", property:"P2" },
    { id:"b13", guestName:"Past Guest 5",  room:"Dorm 1",   roomType:"Dorm",        nights:3, revenue:2400,  source:"Hostelworld",  checkIn:d(-10),checkOut:d(-7), status:"confirmed", guestType:"solo",    city:"Pune",      repeat:false, purpose:"backpacking", property:"P1" },
  ];
}

function demoCafe() {
  return [
    { date: new Date().toISOString().split("T")[0], item: "Masala Chai", qty: 8,  amount: 320  },
    { date: new Date().toISOString().split("T")[0], item: "Thali",       qty: 5,  amount: 1250 },
    { date: new Date().toISOString().split("T")[0], item: "Maggi",       qty: 3,  amount: 270  },
  ];
}

export function getMockData() {
  return {
    bookings: demoBookings(),
    cafe: demoCafe(),
    notes: [],
  };
}
