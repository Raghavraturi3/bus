import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calculator, MapPin } from 'lucide-react';
import { dehradunRoutes, BusStop } from '@/data/dehradunRoutes';
import { useLanguage } from '@/hooks/useLanguage';

const FareCalculator: React.FC = () => {
  const { t } = useLanguage();
  const [fromStop, setFromStop] = useState<string>('');
  const [toStop, setToStop] = useState<string>('');
  const [calculatedFare, setCalculatedFare] = useState<number | null>(null);

  // Get all unique stops from all routes
  const allStops: BusStop[] = [];
  const stopMap = new Map<string, BusStop>();
  
  dehradunRoutes.forEach(route => {
    route.stops.forEach(stop => {
      if (!stopMap.has(stop.id)) {
        stopMap.set(stop.id, stop);
        allStops.push(stop);
      }
    });
  });

  const calculateDistance = (stop1: BusStop, stop2: BusStop): number => {
    // Haversine formula to calculate distance between two points
    const R = 6371; // Earth's radius in kilometers
    const dLat = (stop2.lat - stop1.lat) * Math.PI / 180;
    const dLon = (stop2.lng - stop1.lng) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(stop1.lat * Math.PI / 180) * Math.cos(stop2.lat * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  const calculateFare = () => {
    if (!fromStop || !toStop || fromStop === toStop) return;

    const origin = stopMap.get(fromStop);
    const destination = stopMap.get(toStop);
    
    if (!origin || !destination) return;

    const distance = calculateDistance(origin, destination);
    
    // Base fare structure: ₹10 base + ₹2 per km
    const baseFare = 10;
    const perKmRate = 2;
    const fare = Math.max(baseFare, baseFare + Math.ceil(distance) * perKmRate);
    
    setCalculatedFare(fare);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calculator className="w-5 h-5" />
          {t('fare_calculator')}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              {t('from')}
            </label>
            <Select value={fromStop} onValueChange={setFromStop}>
              <SelectTrigger>
                <SelectValue placeholder={t('select_origin')} />
              </SelectTrigger>
              <SelectContent>
                {allStops.map(stop => (
                  <SelectItem key={stop.id} value={stop.id}>
                    {stop.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              {t('to')}
            </label>
            <Select value={toStop} onValueChange={setToStop}>
              <SelectTrigger>
                <SelectValue placeholder={t('select_destination')} />
              </SelectTrigger>
              <SelectContent>
                {allStops.map(stop => (
                  <SelectItem key={stop.id} value={stop.id}>
                    {stop.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <Button 
          onClick={calculateFare} 
          disabled={!fromStop || !toStop || fromStop === toStop}
          className="w-full"
        >
          {t('calculate_fare')}
        </Button>

        {calculatedFare !== null && (
          <div className="text-center p-4 bg-primary/10 rounded-lg">
            <h3 className="font-semibold text-lg mb-1">{t('estimated_fare')}</h3>
            <p className="text-2xl font-bold text-primary">
              {t('rupees')}{calculatedFare}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default FareCalculator;