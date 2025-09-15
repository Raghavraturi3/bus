import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Info, AlertTriangle, Wrench, Megaphone } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/hooks/useLanguage';

interface Announcement {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'emergency' | 'maintenance';
  priority: number;
  route_id: string | null;
  created_at: string;
  expires_at: string | null;
}

const AnnouncementPanel: React.FC<{ selectedRoute?: string }> = ({ selectedRoute }) => {
  const { t } = useLanguage();
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnnouncements();
  }, [selectedRoute]);

  const fetchAnnouncements = async () => {
    try {
      let query = supabase
        .from('announcements')
        .select('*')
        .eq('active', true)
        .order('priority', { ascending: false })
        .order('created_at', { ascending: false });

      // Filter by route if selected, or show global announcements
      if (selectedRoute) {
        query = query.or(`route_id.eq.${selectedRoute},route_id.is.null`);
      } else {
        query = query.is('route_id', null);
      }

      const { data, error } = await query;
      
      if (error) throw error;
      setAnnouncements((data || []) as Announcement[]);
    } catch (error) {
      console.error('Error fetching announcements:', error);
    } finally {
      setLoading(false);
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'emergency': return <AlertCircle className="w-4 h-4" />;
      case 'warning': return <AlertTriangle className="w-4 h-4" />;
      case 'maintenance': return <Wrench className="w-4 h-4" />;
      default: return <Info className="w-4 h-4" />;
    }
  };

  const getVariant = (type: string) => {
    switch (type) {
      case 'emergency': return 'destructive';
      case 'warning': return 'default';
      case 'maintenance': return 'secondary';
      default: return 'outline';
    }
  };

  if (loading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Megaphone className="w-5 h-5" />
            {t('announcements')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-2">
            <div className="h-4 bg-muted rounded w-3/4"></div>
            <div className="h-4 bg-muted rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Megaphone className="w-5 h-5" />
          {t('announcements')}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {announcements.length === 0 ? (
          <p className="text-muted-foreground text-center py-4">
            {t('no_announcements')}
          </p>
        ) : (
          announcements.map((announcement) => (
            <Alert key={announcement.id} className="relative">
              <div className="flex items-start gap-2">
                {getIcon(announcement.type)}
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold text-sm">{announcement.title}</h4>
                    <Badge variant={getVariant(announcement.type)} className="text-xs">
                      {announcement.type}
                    </Badge>
                  </div>
                  <AlertDescription className="text-sm">
                    {announcement.message}
                  </AlertDescription>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>
                      {new Date(announcement.created_at).toLocaleDateString()}
                    </span>
                    {announcement.expires_at && (
                      <span>
                        Expires: {new Date(announcement.expires_at).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </Alert>
          ))
        )}
      </CardContent>
    </Card>
  );
};

export default AnnouncementPanel;