import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Users, UserCheck } from 'lucide-react';
import { Bus } from '@/data/dehradunRoutes';
import { useLanguage } from '@/hooks/useLanguage';

interface SeatAvailabilityProps {
  bus: Bus;
  size?: 'sm' | 'md' | 'lg';
}

const SeatAvailability: React.FC<SeatAvailabilityProps> = ({ bus, size = 'md' }) => {
  const { t } = useLanguage();
  const occupancyPercentage = (bus.occupancy / bus.capacity) * 100;
  const availableSeats = bus.capacity - bus.occupancy;

  const getAvailabilityColor = () => {
    if (occupancyPercentage >= 90) return 'destructive';
    if (occupancyPercentage >= 70) return 'secondary';
    return 'default';
  };

  const getAvailabilityText = () => {
    if (occupancyPercentage >= 90) return 'Full';
    if (occupancyPercentage >= 70) return 'Limited';
    return 'Available';
  };

  if (size === 'sm') {
    return (
      <div className="flex items-center gap-1 text-xs">
        <Users className="w-3 h-3" />
        <span>{availableSeats}/{bus.capacity}</span>
        <Badge variant={getAvailabilityColor()} className="text-xs px-1">
          {getAvailabilityText()}
        </Badge>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4" />
          <span className="text-sm font-medium">{t('seats_available')}</span>
        </div>
        <Badge variant={getAvailabilityColor()}>
          {availableSeats} / {bus.capacity}
        </Badge>
      </div>
      
      <Progress 
        value={occupancyPercentage} 
        className="h-2"
      />
      
      <div className="flex justify-between text-xs text-muted-foreground">
        <span className="flex items-center gap-1">
          <UserCheck className="w-3 h-3" />
          {t('occupancy')}: {bus.occupancy}
        </span>
        <span>
          {t('capacity')}: {bus.capacity}
        </span>
      </div>
    </div>
  );
};

export default SeatAvailability;