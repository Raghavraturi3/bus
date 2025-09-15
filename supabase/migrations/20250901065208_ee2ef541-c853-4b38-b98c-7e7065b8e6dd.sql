-- Create announcements table for admin alerts
CREATE TABLE public.announcements (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('info', 'warning', 'emergency', 'maintenance')),
  priority INTEGER NOT NULL DEFAULT 1 CHECK (priority BETWEEN 1 AND 5),
  route_id TEXT, -- null means applies to all routes
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE,
  created_by TEXT DEFAULT 'admin'
);

-- Enable Row Level Security
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access (since this is public transit info)
CREATE POLICY "Anyone can view active announcements" 
ON public.announcements 
FOR SELECT 
USING (active = true AND (expires_at IS NULL OR expires_at > now()));

-- Create index for better performance
CREATE INDEX idx_announcements_active_route ON public.announcements(active, route_id) WHERE active = true;
CREATE INDEX idx_announcements_expires ON public.announcements(expires_at) WHERE expires_at IS NOT NULL;

-- Insert sample announcements
INSERT INTO public.announcements (title, message, type, priority, route_id) VALUES
('Route 1 Delay', 'Route 1 buses are running 15 minutes late due to traffic congestion near Clock Tower', 'warning', 3, 'route-1'),
('New Bus Service', 'New express service added to Route 2 starting today!', 'info', 2, 'route-2'),
('Maintenance Alert', 'Route 3 will have reduced frequency between 2-4 PM for road maintenance', 'maintenance', 4, 'route-3'),
('Weather Advisory', 'All routes may experience delays due to heavy rainfall. Please plan accordingly.', 'warning', 3, null);