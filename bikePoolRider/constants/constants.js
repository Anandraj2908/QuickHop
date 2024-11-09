// locations.js

// Combined locations for both pickup and drop
export const LOCATIONS = [
    { id: 1, name: 'Global Bus Stand', address: 'Main Entrance', lat: 12.91242931983958, lng: 77.50058707234462, type: 'pickup' },
    { id: 2, name: 'Global Back Gate', address: 'Rear Exit', lat: 12.916770639697011, lng: 77.500277639682, type: 'pickup' },
    { id: 3, name: 'BGS Arc', address: 'Main Building', lat: 12.906954343616608, lng: 77.49916380605536, type: 'pickup' },
    { id: 4, name: 'Kengeri Crossing', address: 'Junction Point', lat: 12.912429604565734, lng: 77.48552065017432, type: 'pickup' },
    { id: 5, name: 'BGS Hospital', address: 'Medical Center', lat: 12.902666463247161, lng: 77.49822618206055, type: 'drop' },
    { id: 6, name: 'Ganesha Circle', address: 'Main Junction', lat: 12.898329097309421, lng: 77.4964293637215, type: 'drop' },
];

// Rate chart linking pickup and drop locations
export const RATE_CHART = [
    { pickupId: 1, dropId: 5, rate: 10 },  // Global Bus Stand to BGS Hospital
    { pickupId: 1, dropId: 6, rate: 15 },  // Global Bus Stand to Ganesha Circle
    { pickupId: 2, dropId: 5, rate: 10 },  // Global Back Gate to BGS Hospital
    { pickupId: 2, dropId: 6, rate: 15 },  // Global Back Gate to Ganesha Circle
    { pickupId: 3, dropId: 5, rate: 5 },   // BGS Arc to BGS Hospital
    { pickupId: 3, dropId: 6, rate: 10 },  // BGS Arc to Ganesha Circle
    { pickupId: 4, dropId: 5, rate: 15 },  // Kengeri Crossing to BGS Hospital
    { pickupId: 4, dropId: 6, rate: 20 },  // Kengeri Crossing to Ganesha Circle
    // Adding reverse relationships
    { pickupId: 5, dropId: 1, rate: 10 },  // BGS Hospital to Global Bus Stand
    { pickupId: 5, dropId: 2, rate: 10 },  // BGS Hospital to Global Back Gate
    { pickupId: 6, dropId: 1, rate: 15 },  // Ganesha Circle to Global Bus Stand
    { pickupId: 6, dropId: 2, rate: 15 },  // Ganesha Circle to Global Back Gate
    { pickupId: 5, dropId: 3, rate: 5 },   // BGS Hospital to BGS Arc
    { pickupId: 6, dropId: 3, rate: 10 },  // Ganesha Circle to BGS Arc
    { pickupId: 5, dropId: 4, rate: 15 },  // BGS Hospital to Kengeri Crossing
    { pickupId: 6, dropId: 4, rate: 20 },  // Ganesha Circle to Kengeri Crossing
];
