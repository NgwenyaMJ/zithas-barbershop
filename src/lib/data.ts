export const services = [
  { id: "fade", name: "Fade Haircut", description: "A clean fade tailored to your style.", duration: 35, price: 100 },
  { id: "classic", name: "Classic Haircut", description: "A timeless cut with a polished finish.", duration: 30, price: 80 },
  { id: "beard", name: "Beard Trim", description: "Shape, detail and line-up.", duration: 20, price: 60 },
  { id: "combo", name: "Haircut & Beard", description: "The complete fresh look.", duration: 50, price: 150 },
  { id: "kids", name: "Kids Haircut", description: "A neat, comfortable cut for kids.", duration: 30, price: 70 },
  { id: "design", name: "Haircut with Design", description: "A custom look with detailed finishing.", duration: 45, price: 170 }
];

export const barbers = [
  { id: "any", name: "Any available barber", role: "First available" },
  { id: "thabo", name: "Thabo", role: "Senior barber" },
  { id: "sizwe", name: "Sizwe", role: "Barber" },
  { id: "lucky", name: "Lucky", role: "Barber" }
];

export const demoQueue = [
  { ticket: "Q-014", name: "Kabelo M.", service: "Fade Haircut", status: "In chair", wait: "Now" },
  { ticket: "Q-015", name: "Sipho D.", service: "Classic Haircut", status: "Waiting", wait: "15–25 min" },
  { ticket: "Q-016", name: "Neo P.", service: "Beard Trim", status: "Waiting", wait: "30–40 min" }
];
