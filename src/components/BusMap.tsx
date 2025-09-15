import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Bus, Route, dehradunBuses, dehradunRoutes } from '@/data/dehradunRoutes';

// Fix for default markers in Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

interface BusMapProps {
  selectedRoute?: string;
  selectedBus?: string;
  onBusClick?: (bus: Bus) => void;
  buses?: Bus[]; // Allow passing custom bus data
}

const BusMap: React.FC<BusMapProps> = ({ selectedRoute, selectedBus, onBusClick, buses = dehradunBuses }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const map = useRef<L.Map | null>(null);
  const busMarkers = useRef<L.LayerGroup>(new L.LayerGroup());
  const routeLines = useRef<L.LayerGroup>(new L.LayerGroup());

  // Initialize map
  useEffect(() => {
    if (!mapRef.current || map.current) return;

    // Create map centered on Dehradun
    map.current = L.map(mapRef.current, {
      center: [30.894552432530066, 75.86055640720483], // Ludhiana, Punjab
      zoom: 8.6,
      zoomControl: false,
    });

    // Add tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(map.current);

    // Add zoom control to top right
    L.control.zoom({ position: 'topright' }).addTo(map.current);

    // Add layer groups to map
    busMarkers.current.addTo(map.current);
    routeLines.current.addTo(map.current);

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []);

  // Update route lines
  useEffect(() => {
    if (!map.current) return;

    routeLines.current.clearLayers();

    const routesToShow = selectedRoute 
      ? dehradunRoutes.filter(route => route.id === selectedRoute)
      : dehradunRoutes;

    routesToShow.forEach(route => {
      const polylinePoints = route.stops.map(stop => [stop.lat, stop.lng] as [number, number]);
      
      const polyline = L.polyline(polylinePoints, {
        color: route.color,
        weight: 4,
        opacity: 0.7,
        smoothFactor: 1
      });

      polyline.addTo(routeLines.current);

      // Add route popup
      polyline.bindPopup(`
        <div class="p-3">
          <h3 class="font-semibold text-lg">${route.name}</h3>
          <p class="text-sm text-muted-foreground">Route: ${route.code}</p>
          <p class="text-sm">Distance: ${route.totalDistance} km</p>
          <p class="text-sm">Time: ${route.estimatedTime}</p>
        </div>
      `);

      // Add bus stops
      route.stops.forEach((stop, index) => {
        const stopMarker = L.circleMarker([stop.lat, stop.lng], {
          radius: 6,
          fillColor: route.color,
          color: '#ffffff',
          weight: 2,
          opacity: 1,
          fillOpacity: 0.8
        });

        stopMarker.bindPopup(`
          <div class="p-2">
            <h4 class="font-medium">${stop.name}</h4>
            <p class="text-xs text-muted-foreground">Stop ${index + 1} on ${route.name}</p>
          </div>
        `);

        stopMarker.addTo(routeLines.current);
      });
    });
  }, [selectedRoute]);

  // Update bus markers
  useEffect(() => {
    if (!map.current) return;

    busMarkers.current.clearLayers();

    const busesToShow = selectedRoute 
      ? buses.filter(bus => bus.routeId === selectedRoute)
      : buses;

    busesToShow.forEach(bus => {
      const route = dehradunRoutes.find(r => r.id === bus.routeId);
      if (!route) return;

      // Create custom bus icon
      const busIcon = L.divIcon({
        html: `
          <div class="bus-marker animate-marker-pulse" style="background-color: ${route.color}">
            🚌
          </div>
        `,
        className: 'custom-bus-marker',
        iconSize: [32, 32],
        iconAnchor: [16, 16]
      });

      const marker = L.marker([bus.lat, bus.lng], { icon: busIcon });

      // Add bus popup with detailed info
      const occupancyPercentage = (bus.occupancy / bus.capacity) * 100;
      const availableSeats = bus.capacity - bus.occupancy;
      const seatStatus = occupancyPercentage >= 90 ? 'Full' : occupancyPercentage >= 70 ? 'Limited' : 'Available';
      const seatStatusColor = occupancyPercentage >= 90 ? '#ef4444' : occupancyPercentage >= 70 ? '#f59e0b' : '#10b981';

      marker.bindPopup(`
        <div class="p-4 min-w-[200px]">
          <h3 class="font-semibold text-lg">${bus.name}</h3>
          <p class="text-sm text-muted-foreground mb-2">Code: ${bus.code}</p>
          <div class="space-y-1 text-sm">
            <p><span class="font-medium">Route:</span> ${route.name}</p>
            <p><span class="font-medium">Driver:</span> ${bus.driver}</p>
            <p><span class="font-medium">Speed:</span> ${bus.speed} km/h</p>
            <p><span class="font-medium">Next Stop:</span> ${bus.nextStop}</p>
            <p class="flex items-center gap-2">
              <span class="font-medium">Status:</span>
              <span class="px-2 py-1 rounded-full text-xs status-${bus.status}">
                ${bus.status.charAt(0).toUpperCase() + bus.status.slice(1)}
              </span>
            </p>
            <div class="mt-2 p-2 bg-gray-50 rounded">
              <div class="flex items-center justify-between mb-1">
                <span class="font-medium">Seats:</span>
                <span style="color: ${seatStatusColor}; font-weight: bold;">${seatStatus}</span>
              </div>
              <div class="w-full bg-gray-200 rounded-full h-2">
                <div class="h-2 rounded-full" style="width: ${occupancyPercentage}%; background-color: ${seatStatusColor};"></div>
              </div>
              <p class="text-xs mt-1">${availableSeats} of ${bus.capacity} available</p>
            </div>
          </div>
        </div>
      `);

      // Handle bus click
      marker.on('click', () => {
        if (onBusClick) {
          onBusClick(bus);
        }
      });

      // Highlight selected bus
      if (selectedBus === bus.id) {
        marker.setZIndexOffset(1000);
        setTimeout(() => {
          marker.openPopup();
        }, 100);
      }

      marker.addTo(busMarkers.current);
    });
  }, [selectedRoute, selectedBus, onBusClick, buses]); // Add buses dependency

  return (
    <div className="relative w-full h-full">
      <div ref={mapRef} className="map-container" />
      
      {/* Map overlay with controls */}
      <div className="absolute top-4 left-4 z-[1000] space-y-2">
        <div className="glass p-3 rounded-lg">
          <h3 className="font-semibold text-sm">Smart Bus Tracker</h3>
          <p className="text-xs text-muted-foreground">Live locations</p>
        </div>
      </div>

      {/* Legend */}
      <div className="absolute bottom-4 left-4 z-[1000]">
        <div className="glass p-3 rounded-lg space-y-2">
          <h4 className="font-medium text-sm">Legend</h4>
          <div className="space-y-1 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span>Active</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <span>Delayed</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <span>Inactive</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusMap;