import { useState, useEffect } from 'react';
import { Bus, dehradunBuses, Route, dehradunRoutes } from '@/data/dehradunRoutes';

export const useBusUpdates = () => {
  const [buses, setBuses] = useState<Bus[]>(dehradunBuses);

  // Simulate bus movement and status updates
  useEffect(() => {
    const updateInterval = setInterval(() => {
      setBuses(prevBuses => 
        prevBuses.map(bus => {
          // Skip inactive buses
          if (bus.status === 'inactive') return bus;

          const route = dehradunRoutes.find(r => r.id === bus.routeId);
          if (!route) return bus;

          // Simulate movement along route
          const currentStopIndex = route.stops.findIndex(stop => 
            Math.abs(stop.lat - bus.lat) < 0.005 && Math.abs(stop.lng - bus.lng) < 0.005
          );

          let newLat = bus.lat;
          let newLng = bus.lng;
          let newSpeed = bus.speed;
          let newStatus: 'active' | 'delayed' | 'inactive' = bus.status;
          let newNextStop = bus.nextStop;

          // Random movement simulation
          const moveDistance = 0.001; // Small movement increment
          const direction = Math.random() * 2 * Math.PI;
          
          // Move towards next stop in route
          if (currentStopIndex >= 0 && currentStopIndex < route.stops.length - 1) {
            const nextStop = route.stops[currentStopIndex + 1];
            const deltaLat = nextStop.lat - bus.lat;
            const deltaLng = nextStop.lng - bus.lng;
            const distance = Math.sqrt(deltaLat * deltaLat + deltaLng * deltaLng);
            
            if (distance > moveDistance) {
              newLat += (deltaLat / distance) * moveDistance;
              newLng += (deltaLng / distance) * moveDistance;
              newNextStop = nextStop.name;
            } else {
              // Reached the stop, move to next one
              newLat = nextStop.lat;
              newLng = nextStop.lng;
              if (currentStopIndex + 2 < route.stops.length) {
                newNextStop = route.stops[currentStopIndex + 2].name;
              }
            }
          } else {
            // Random movement if not on specific route segment
            newLat += Math.sin(direction) * moveDistance;
            newLng += Math.cos(direction) * moveDistance;
          }

          // Random speed and status changes
          if (Math.random() < 0.1) { // 10% chance to change speed
            newSpeed = Math.max(5, Math.min(50, bus.speed + (Math.random() - 0.5) * 10));
          }

          if (Math.random() < 0.05) { // 5% chance to change status
            const statuses: ('active' | 'delayed' | 'inactive')[] = ['active', 'delayed', 'inactive'];
            newStatus = statuses[Math.floor(Math.random() * statuses.length)];
          }

          // Random occupancy changes
          const newOccupancy = Math.random() < 0.2 ? 
            Math.max(0, Math.min(bus.capacity, bus.occupancy + Math.floor((Math.random() - 0.5) * 5))) : 
            bus.occupancy;

          return {
            ...bus,
            lat: newLat,
            lng: newLng,
            speed: Math.round(newSpeed),
            status: newStatus,
            nextStop: newNextStop,
            occupancy: newOccupancy,
            lastUpdated: new Date()
          };
        })
      );
    }, 3000); // Update every 3 seconds

    return () => clearInterval(updateInterval);
  }, []);

  return buses;
};