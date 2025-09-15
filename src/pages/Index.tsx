import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { RefreshCw, MapPin, Bus, Navigation } from 'lucide-react';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import BusMap from '@/components/BusMap';
import RouteSidebar from '@/components/RouteSidebar';
import FareCalculator from '@/components/FareCalculator';
import AnnouncementPanel from '@/components/AnnouncementPanel';
import SeatAvailability from '@/components/SeatAvailability';
import LanguageToggle from '@/components/LanguageToggle';
import { Bus as BusType, dehradunBuses } from '@/data/dehradunRoutes';
import { useBusUpdates } from '@/hooks/useBusUpdates';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/hooks/useLanguage';

const Index = () => {
  const { toast } = useToast();
  const { t } = useLanguage();
  const buses = useBusUpdates(); // Use live updating buses
  const [selectedRoute, setSelectedRoute] = useState<string | undefined>();
  const [selectedBus, setSelectedBus] = useState<string | undefined>();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showFareCalculator, setShowFareCalculator] = useState(false);

  const handleBusClick = (bus: BusType) => {
    setSelectedBus(bus.id);
    toast({
      title: `${t('bus_selected')}: ${bus.name}`,
      description: `${bus.code} - ${bus.occupancy}/${bus.capacity} ${t('seats_available')}`,
      duration: 3000,
    });
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Simulate API call
    setTimeout(() => {
      setIsRefreshing(false);
      toast({
        title: t('data_refreshed'),
        description: t('bus_locations_updated'),
        duration: 2000,
      });
    }, 1500);
  };

  const handleCenterMap = () => {
    toast({
      title: t('map_centered'),
      description: t('map_view_centered'),
      duration: 2000,
    });
  };

  const selectedBusData = selectedBus ? buses.find(bus => bus.id === selectedBus) : null;

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border shadow-sm z-10">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-hero rounded-lg">
              <Bus className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-hero bg-clip-text text-transparent">
                {t('smart_bus_tracker')}
              </h1>
              <p className="text-sm text-muted-foreground">
                {t('real_time_tracking')}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Fare Calculator Toggle */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFareCalculator(!showFareCalculator)}
              className="hover-lift"
            >
              {showFareCalculator ? 'Hide Calculator' : 'Fare Calculator'}
            </Button>

            {/* Refresh Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="hover-lift"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
              {t('refresh')}
            </Button>

            {/* Center Map Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={handleCenterMap}
              className="hover-lift"
            >
              <Navigation className="h-4 w-4 mr-2" />
              {t('center_map')}
            </Button>

            {/* Language Toggle */}
            <LanguageToggle />

            {/* Theme Toggle */}
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <RouteSidebar
          selectedRoute={selectedRoute}
          selectedBus={selectedBus}
          onRouteSelect={setSelectedRoute}
          onBusSelect={setSelectedBus}
          isCollapsed={sidebarCollapsed}
          onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        />

        {/* Map Container */}
        <div className="flex-1 relative">
          <BusMap
            selectedRoute={selectedRoute}
            selectedBus={selectedBus}
            onBusClick={handleBusClick}
            buses={buses} // Pass live updating buses
          />

          {/* Fare Calculator Overlay - moved to avoid clashing */}
          {showFareCalculator && (
            <div className="absolute top-20 left-4 z-[1000] w-80 lg:w-96">
              <FareCalculator />
            </div>
          )}

          {/* Selected Bus Info - moved to avoid clashing with calculator */}
          {selectedBusData && !showFareCalculator && (
            <div className="absolute top-4 right-4 z-[1000] w-80">
              <Card className="glass">
                <CardContent className="p-4 space-y-3">
                  <div>
                    <h3 className="font-semibold text-lg">{selectedBusData.name}</h3>
                    <Badge variant="outline" className="text-xs">
                      {selectedBusData.code}
                    </Badge>
                  </div>
                  
                  <SeatAvailability bus={selectedBusData} />
                  
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="font-medium">{t('driver')}:</span>
                      <p>{selectedBusData.driver}</p>
                    </div>
                    <div>
                      <span className="font-medium">{t('speed')}:</span>
                      <p>{selectedBusData.speed} {t('kmh')}</p>
                    </div>
                    <div className="col-span-2">
                      <span className="font-medium">{t('next_stop')}:</span>
                      <p>{selectedBusData.nextStop}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Announcements Panel - repositioned */}
          <div className="absolute bottom-4 right-4 z-[1000] w-72 lg:w-80">
            <AnnouncementPanel selectedRoute={selectedRoute} />
          </div>

          {/* Floating Action Buttons */}
          <div className="absolute bottom-6 left-6 z-[1000] space-y-3">
            {/* Quick Stats Card */}
            <div className="glass p-4 rounded-xl animate-float">
              <div className="text-center">
                <p className="text-2xl font-bold text-primary">
                  {selectedRoute ? 
                    (selectedRoute.split('-')[1] ? `Route ${selectedRoute.split('-')[1]}` : 'Route') 
                    : '10'
                  }
                </p>
                <p className="text-xs text-muted-foreground">
                  {selectedRoute ? 'Selected Route' : 'Total Buses'}
                </p>
              </div>
            </div>

            {/* Toggle Sidebar Button (Mobile) */}
            <Button
              className="btn-floating lg:hidden"
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            >
              <MapPin className="h-5 w-5" />
            </Button>
          </div>

          {/* Loading Overlay */}
          {isRefreshing && (
            <div className="absolute inset-0 bg-background/50 backdrop-blur-sm z-[2000] flex items-center justify-center">
              <div className="glass p-6 rounded-xl flex items-center gap-3">
                <RefreshCw className="h-5 w-5 animate-spin text-primary" />
                <span className="font-medium">Updating bus locations...</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Bottom Sheet Indicator */}
      <div className="lg:hidden">
        {(selectedRoute || selectedBus) && (
          <div className="bg-card border-t border-border p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-sm">
                  {selectedBus ? 'Bus Selected' : 'Route Selected'}
                </p>
                <p className="text-xs text-muted-foreground">
                  Tap map markers for details
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSelectedRoute(undefined);
                  setSelectedBus(undefined);
                }}
              >
                Clear
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;