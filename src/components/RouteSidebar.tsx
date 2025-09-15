import React, { useState } from 'react';
import { Search, Filter, Bus, MapPin, Clock, Users, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { 
  dehradunRoutes, 
  dehradunBuses, 
  getBusesByRoute, 
  Bus as BusType,
  Route 
} from '@/data/dehradunRoutes';

interface RouteSidebarProps {
  selectedRoute?: string;
  selectedBus?: string;
  onRouteSelect: (routeId: string | undefined) => void;
  onBusSelect: (busId: string | undefined) => void;
  isCollapsed: boolean;
  onToggle: () => void;
}

const RouteSidebar: React.FC<RouteSidebarProps> = ({
  selectedRoute,
  selectedBus,
  onRouteSelect,
  onBusSelect,
  isCollapsed,
  onToggle
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'delayed' | 'inactive'>('all');

  // Filter routes and buses based on search and status
  const filteredRoutes = dehradunRoutes.filter(route =>
    route.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    route.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredBuses = dehradunBuses.filter(bus => {
    const matchesSearch = bus.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         bus.code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || bus.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'delayed': return 'bg-yellow-500';
      case 'inactive': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getRouteColor = (routeId: string) => {
    const route = dehradunRoutes.find(r => r.id === routeId);
    return route?.color || '#6B7280';
  };

  if (isCollapsed) {
    return (
      <div className="w-16 bg-sidebar border-r border-sidebar-border h-full flex flex-col items-center py-4 space-y-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggle}
          className="text-sidebar-foreground hover:bg-sidebar-accent"
        >
          <Bus className="h-5 w-5" />
        </Button>
        
        <Separator className="w-8" />
        
        {/* Route indicators */}
        <div className="space-y-2">
          {dehradunRoutes.slice(0, 5).map((route, index) => (
            <div
              key={route.id}
              className={`w-3 h-3 rounded-full cursor-pointer transition-all duration-200 hover:scale-125 ${
                selectedRoute === route.id ? 'ring-2 ring-sidebar-primary ring-offset-1' : ''
              }`}
              style={{ backgroundColor: route.color }}
              onClick={() => onRouteSelect(selectedRoute === route.id ? undefined : route.id)}
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="w-80 bg-sidebar border-r border-sidebar-border h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-sidebar-border">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-sidebar-foreground">Routes & Buses</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggle}
            className="text-sidebar-foreground hover:bg-sidebar-accent"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Search */}
        <div className="relative mb-3">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-sidebar-foreground/60" />
          <Input
            placeholder="Search routes or buses..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-sidebar-accent border-sidebar-border text-sidebar-foreground placeholder:text-sidebar-foreground/60"
          />
        </div>

        {/* Status Filter */}
        <div className="flex gap-2">
          {(['all', 'active', 'delayed', 'inactive'] as const).map((status) => (
            <Button
              key={status}
              variant={statusFilter === status ? "default" : "outline"}
              size="sm"
              onClick={() => setStatusFilter(status)}
              className={`text-xs ${
                statusFilter === status 
                  ? 'bg-sidebar-primary text-sidebar-primary-foreground' 
                  : 'border-sidebar-border text-sidebar-foreground hover:bg-sidebar-accent'
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </Button>
          ))}
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-4">
          {/* Routes Section */}
          <div>
            <h3 className="font-medium text-sidebar-foreground mb-3 flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Routes ({filteredRoutes.length})
            </h3>
            <div className="space-y-2">
              {filteredRoutes.map((route) => {
                const routeBuses = getBusesByRoute(route.id);
                const activeBuses = routeBuses.filter(bus => bus.status === 'active').length;
                const isSelected = selectedRoute === route.id;

                return (
                  <Card
                    key={route.id}
                    className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                      isSelected 
                        ? 'bg-sidebar-accent border-sidebar-primary shadow-sm' 
                        : 'bg-sidebar hover:bg-sidebar-accent border-sidebar-border'
                    }`}
                    onClick={() => onRouteSelect(isSelected ? undefined : route.id)}
                  >
                    <CardContent className="p-3">
                      <div className="flex items-start gap-3">
                        <div
                          className="w-4 h-4 rounded-full mt-1 flex-shrink-0"
                          style={{ backgroundColor: route.color }}
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-sm text-sidebar-foreground truncate">
                            {route.name}
                          </h4>
                          <p className="text-xs text-sidebar-foreground/70 mb-2">
                            {route.code} • {route.totalDistance} km
                          </p>
                          <div className="flex items-center justify-between">
                            <Badge variant="outline" className="text-xs border-sidebar-border">
                              {activeBuses}/{routeBuses.length} active
                            </Badge>
                            <span className="text-xs text-sidebar-foreground/60 flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {route.estimatedTime}
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          <Separator className="bg-sidebar-border" />

          {/* Buses Section */}
          <div>
            <h3 className="font-medium text-sidebar-foreground mb-3 flex items-center gap-2">
              <Bus className="h-4 w-4" />
              Buses ({filteredBuses.length})
            </h3>
            <div className="space-y-2">
              {filteredBuses.map((bus) => {
                const route = dehradunRoutes.find(r => r.id === bus.routeId);
                const isSelected = selectedBus === bus.id;

                return (
                  <Card
                    key={bus.id}
                    className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                      isSelected 
                        ? 'bg-sidebar-accent border-sidebar-primary shadow-sm' 
                        : 'bg-sidebar hover:bg-sidebar-accent border-sidebar-border'
                    }`}
                    onClick={() => onBusSelect(isSelected ? undefined : bus.id)}
                  >
                    <CardContent className="p-3">
                      <div className="flex items-start gap-3">
                        <div className="flex flex-col items-center">
                          <div
                            className={`w-3 h-3 rounded-full ${getStatusColor(bus.status)} animate-pulse`}
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <h4 className="font-medium text-sm text-sidebar-foreground truncate">
                              {bus.name}
                            </h4>
                            <Badge
                              variant="outline"
                              className="text-xs border-sidebar-border"
                              style={{ color: route?.color }}
                            >
                              {bus.code}
                            </Badge>
                          </div>
                          <p className="text-xs text-sidebar-foreground/70 mb-2">
                            Route: {route?.name}
                          </p>
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-sidebar-foreground/60">
                              {bus.speed} km/h • {bus.driver}
                            </span>
                            <Badge
                              className={`status-${bus.status} text-xs`}
                            >
                              {bus.status}
                            </Badge>
                          </div>
                          <p className="text-xs text-sidebar-foreground/60 mt-1">
                            Next: {bus.nextStop}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </div>
      </ScrollArea>

      {/* Footer Stats */}
      <div className="p-4 border-t border-sidebar-border">
        <div className="grid grid-cols-3 gap-2 text-center">
          <div>
            <p className="text-lg font-semibold text-sidebar-foreground">
              {dehradunBuses.filter(b => b.status === 'active').length}
            </p>
            <p className="text-xs text-sidebar-foreground/60">Active</p>
          </div>
          <div>
            <p className="text-lg font-semibold text-sidebar-foreground">
              {dehradunRoutes.length}
            </p>
            <p className="text-xs text-sidebar-foreground/60">Routes</p>
          </div>
          <div>
            <p className="text-lg font-semibold text-sidebar-foreground">
              {dehradunBuses.length}
            </p>
            <p className="text-xs text-sidebar-foreground/60">Total</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RouteSidebar;