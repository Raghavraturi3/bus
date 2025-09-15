export interface BusStop {
  id: string;
  name: string;
  lat: number;
  lng: number;
}

export interface Bus {
  id: string;
  name: string;
  code: string;
  routeId: string;
  lat: number;
  lng: number;
  status: 'active' | 'delayed' | 'inactive';
  speed: number;
  driver: string;
  nextStop: string;
  lastUpdated: Date;
  capacity: number;
  occupancy: number;
  fare: {
    baseFare: number;
    perKmRate: number;
  };
}

export interface Route {
  id: string;
  name: string;
  code: string;
  color: string;
  startPoint: string;
  endPoint: string;
  stops: BusStop[];
  totalDistance: number;
  estimatedTime: string;
}

// Sample Dehradun routes and bus stops
export const dehradunRoutes: Route[] = [
  {
    id: "route-1",
    name: "Bathinda - Barnala",
    code: "DTU-01",
    color: "#3B82F6", // Blue
    startPoint: "Bathinda",
    endPoint: "Barnala",
    totalDistance: 64.3,
    estimatedTime: "1 hr 30 mins",
    stops: [
      { id: "stop-1", name: "Bathinda", lat: 30.20745447327828, lng: 74.93421752757521 },
      { id: "stop-2", name: "Bhucho Mandi", lat: 30.220316436224454, lng:  75.0837337227625 },
      { id: "stop-3", name: "Rampura Phul", lat: 30.270956088835526, lng: 75.2423513647077 },
      { id: "stop-4", name: "Jethuke", lat: 30.28955087417217, lng: 75.31951370459468 },
      { id: "stop-5", name: "Tapa", lat: 30.301759473870824, lng: 75.37045949952224 },
      { id: "stop-6", name: "Handiaya", lat: 30.329564659716812, lng: 75.5122613424514 },
      { id: "stop-7", name: "Barnala", lat: 30.38085737776687, lng: 75.54516973576024 }
    ]
  },
  {
    id: "route-2",  
    name: "Sangrur - Mansa",
    code: "DTU-02",
    color: "#8B5CF6", // Purple
    startPoint: "Rajpur Road",
    endPoint: "Mussoorie",
    totalDistance: 35.8,
    estimatedTime: "1.5 hours",
    stops: [
      { id: "stop-8", name: "Sangrur", lat: 30.24651216399327, lng: 75.84347223395416 },
      { id: "stop-9", name: "Sunam Udham Singh Wala", lat: 30.142681140244875, lng: 75.8079047177424 },
      { id: "stop-10", name: "Cheema", lat: 30.10311892695762, lng: 75.6729181170112 },
      { id: "stop-11", name: "Bhikhi", lat: 30.063540870029325, lng: 75.53793151628003 },
      { id: "stop-12", name: "Khaila Kalan", lat: 30.041331613204797, lng: 75.44087503476256 },
      { id: "stop-13", name: "Mansa", lat: 30.00752536410794, lng: 75.38732663116672 }
    ]
  },
  {
    id: "route-3",
    name: "Hoshiarpur - Nawanshahr",
    code: "DTU-03", 
    color: "#EC4899", // Pink
    startPoint: "Clement Town",
    endPoint: "Rishikesh",
    totalDistance: 28.5,
    estimatedTime: "1.2 hours",
    stops: [
      { id: "stop-14", name: "Hoshiarpur", lat: 31.505725241811504, lng: 75.88952009991718 },
      { id: "stop-15", name: "Chabbewal", lat: 31.44480062410503, lng: 75.99072081092953 },
      { id: "stop-16", name: "Mahilpur", lat: 31.355055190893633, lng: 76.03445309452698 },
      { id: "stop-17", name: "Saila Khurd", lat: 31.300212713290744, lng: 76.0800463263626 },
      { id: "stop-18", name: "Garhshankar", lat: 31.21828699815122, lng: 76.11540434288821 },
      { id: "stop-19", name: "Nawanshahr", lat: 31.128325593763368, lng: 76.12098718760278 }
    ]
  },
  {
    id: "route-4",
    name: "Ludhiana - Jalandhar",
    code: "DTU-04",
    color: "#F59E0B", // Orange
    startPoint: "Premnagar",
    endPoint: "Dehradun University",
    totalDistance: 12.3,
    estimatedTime: "35 mins",
    stops: [
      { id: "stop-20", name: "Ludhiana", lat: 30.90880861979299, lng: 75.60524803079197 },
      { id: "stop-21", name: "Phillaur", lat: 31.01824969770126, lng: 75.79357661559503 },
      { id: "stop-22", name: "Goraya", lat: 31.12054341131583, lng: 75.77584003719552 },
      { id: "stop-23", name: "Phagwara", lat: 31.22879382502805, lng: 75.77111028295566 },
      { id: "stop-24", name: "Jalandhar", lat: 31.33288049555118, lng: 75.55708890360174 }
    ]
  },
  {
    id: "route-5",
    name: "Chandigarh - Ludhiana",
    code: "DTU-05",
    color: "#059669", // Teal
    startPoint: "Haridwar Road", 
    endPoint: "ONGC",
    totalDistance: 18.7,
    estimatedTime: "55 mins",
    stops: [
      { id: "stop-25", name: "Chandigarh", lat: 30.721323552507325, lng: 76.79138235819211 },
      { id: "stop-26", name: "Kharar", lat: 30.755632230264325, lng: 76.63357354684803 },
      { id: "stop-27", name: "Morinda", lat: 30.786535351268608, lng: 76.49546195971958 },
      { id: "stop-28", name: "Khamanon", lat: 30.81320424216226, lng: 76.34786620922758 },
      { id: "stop-29", name: "Sarmala", lat: 30.83510643518034, lng: 76.19662392924664 },
      { id: "stop-30", name: "Ludhiana", lat: 30.90880861979299, lng: 75.60524803079197 }
    ]
  }
];

// Sample buses for the routes
export const dehradunBuses: Bus[] = [
  {
    id: "bus-1",
    name: "Punjabi Lassi",
    code: "PNJ-01-A",
    routeId: "route-1", 
    lat: 30.20745447327828,
    lng: 74.93421752757521,
    status: "active",
    speed: 35,
    driver: "Rajesh Kumar",
    nextStop: "Bhucho Mandi",
    lastUpdated: new Date(),
    capacity: 45,
    occupancy: 32,
    fare: { baseFare: 10, perKmRate: 2 }
  },
  {
    id: "bus-2",
    name: "Sahastra Link",
    code: "DH-01-B",
    routeId: "route-1",
    lat: 30.270956088835526, 
    lng: 75.2423513647077,
    status: "delayed",
    speed: 15,
    driver: "Suresh Singh",
    nextStop: "Jethuke",
    lastUpdated: new Date(),
    capacity: 45,
    occupancy: 38,
    fare: { baseFare: 10, perKmRate: 2 }
  },
  {
    id: "bus-3", 
    name: "Hill Queen",
    code: "DH-02-A",
    routeId: "route-2",
    lat: 30.24651216399327, lng: 75.84347223395416,
    status: "active",
    speed: 28,
    driver: "Prakash Negi",
    nextStop: "Maldevta",
    lastUpdated: new Date(),
    capacity: 50,
    occupancy: 28,
    fare: { baseFare: 12, perKmRate: 2.5 }
  },
  {
    id: "bus-4",
    name: "Mussoorie Express",
    code: "DH-02-B", 
    routeId: "route-2",
    lat: 30.063540870029325, lng: 75.53793151628003,
    status: "active",
    speed: 32,
    driver: "Amit Thapa",
    nextStop: "Kempty Fall Road",
    lastUpdated: new Date(),
    capacity: 50,
    occupancy: 42,
    fare: { baseFare: 12, perKmRate: 2.5 }
  },
  {
    id: "bus-5",
    name: "Ganga Express",
    code: "DH-03-A",
    routeId: "route-3",
    lat: 31.505725241811504, lng: 75.88952009991718,
    status: "inactive",
    speed: 0,
    driver: "Mohan Lal",
    nextStop: "Survey of India",
    lastUpdated: new Date(),
    capacity: 40,
    occupancy: 0,
    fare: { baseFare: 15, perKmRate: 3 }
  },
  {
    id: "bus-6",
    name: "Airport Shuttle",
    code: "DH-03-B",
    routeId: "route-3", 
    lat: 31.300212713290744, lng: 76.0800463263626,
    status: "active",
    speed: 45,
    driver: "Deepak Rawat",
    nextStop: "Doiwala",
    lastUpdated: new Date(),
    capacity: 40,
    occupancy: 25,
    fare: { baseFare: 15, perKmRate: 3 }
  },
  {
    id: "bus-7",
    name: "University Link",
    code: "DH-04-A",
    routeId: "route-4",
    lat: 30.90880861979299, lng: 75.60524803079197,
    status: "active",
    speed: 25,
    driver: "Vinod Kumar",
    nextStop: "Kaulagarh",
    lastUpdated: new Date(),
    capacity: 35,
    occupancy: 20,
    fare: { baseFare: 8, perKmRate: 1.5 }
  },
  {
    id: "bus-8",
    name: "Campus Connect",
    code: "DH-04-B",
    routeId: "route-4",
    lat: 31.22879382502805, lng: 75.77111028295566,
    status: "delayed",
    speed: 10,
    driver: "Ramesh Pant",
    nextStop: "Dehradun University",
    lastUpdated: new Date(),
    capacity: 35,
    occupancy: 30,
    fare: { baseFare: 8, perKmRate: 1.5 }
  },
  {
    id: "bus-9",
    name: "ONGC Special",
    code: "DH-05-A",
    routeId: "route-5",
    lat: 30.721323552507325, lng: 76.79138235819211,
    status: "active",
    speed: 30,
    driver: "Anil Bisht", 
    nextStop: "Nehru Colony",
    lastUpdated: new Date(),
    capacity: 40,
    occupancy: 15,
    fare: { baseFare: 12, perKmRate: 2 }
  },
  {
    id: "bus-10",
    name: "Corporate Shuttle",
    code: "DH-05-B",
    routeId: "route-5",
    lat: 30.81320424216226, lng: 76.34786620922758,
    status: "active",
    speed: 40,
    driver: "Ravi Chauhan",
    nextStop: "ONGC",
    lastUpdated: new Date(),
    capacity: 40,
    occupancy: 35,
    fare: { baseFare: 12, perKmRate: 2 }
  }
];

// Get route by ID helper
export const getRouteById = (routeId: string): Route | undefined => {
  return dehradunRoutes.find(route => route.id === routeId);
};

// Get buses by route helper  
export const getBusesByRoute = (routeId: string): Bus[] => {
  return dehradunBuses.filter(bus => bus.routeId === routeId);
};

// Get all active buses
export const getActiveBuses = (): Bus[] => {
  return dehradunBuses.filter(bus => bus.status !== 'inactive');
};