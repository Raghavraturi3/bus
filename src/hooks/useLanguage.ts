import { useState, useEffect } from 'react';

export type Language = 'en' | 'hi';

interface Translations {
  [key: string]: {
    en: string;
    hi: string;
  };
}

const translations: Translations = {
  // Navigation
  'bus_tracking': { en: 'Bus Tracking', hi: 'बस ट्रैकिंग' },
  'Sarthi': { en: 'Saarthi', hi: 'सारथी' },
  'Punjab_bus_pulse': { en: 'Punjab Bus Pulse', hi: 'पंजाब बस पल्स' },
  'real_time_tracking': { en: 'Real-time tracking', hi: 'रियल-टाइम ट्रैकिंग' },
  
  // Bus Status
  'active': { en: 'Active', hi: 'सक्रिय' },
  'delayed': { en: 'Delayed', hi: 'देरी' },
  'inactive': { en: 'Inactive', hi: 'निष्क्रिय' },
  
  // General
  'route': { en: 'Route', hi: 'मार्ग' },
  'driver': { en: 'Driver', hi: 'चालक' },
  'speed': { en: 'Speed', hi: 'गति' },
  'next_stop': { en: 'Next Stop', hi: 'अगला स्टॉप' },
  'status': { en: 'Status', hi: 'स्थिति' },
  'refresh': { en: 'Refresh', hi: 'रीफ्रेश' },
  'center_map': { en: 'Center Map', hi: 'मैप केंद्रित करें' },
  'map_centered': { en: 'Map Centered', hi: 'मैप केंद्रित' },
  'map_view_centered': { en: 'Map view centered on Dehradun', hi: 'मैप व्यू देहरादून पर केंद्रित' },
  'data_refreshed': { en: 'Data Refreshed', hi: 'डेटा रीफ्रेश' },
  'bus_locations_updated': { en: 'Bus locations and routes updated', hi: 'बस स्थान और मार्ग अपडेट' },
  'bus_selected': { en: 'Bus Selected', hi: 'बस चुनी गई' },
  
  // Seat Availability
  'seats_available': { en: 'Seats Available', hi: 'उपलब्ध सीटें' },
  'capacity': { en: 'Capacity', hi: 'क्षमता' },
  'occupancy': { en: 'Occupancy', hi: 'अधिभोग' },
  
  // Fare Calculator
  'fare_calculator': { en: 'Fare Calculator', hi: 'किराया कैलकुलेटर' },
  'from': { en: 'From', hi: 'से' },
  'to': { en: 'To', hi: 'तक' },
  'calculate_fare': { en: 'Calculate Fare', hi: 'किराया गणना करें' },
  'estimated_fare': { en: 'Estimated Fare', hi: 'अनुमानित किराया' },
  'select_origin': { en: 'Select origin stop', hi: 'प्रारंभिक स्टॉप चुनें' },
  'select_destination': { en: 'Select destination stop', hi: 'गंतव्य स्टॉप चुनें' },
  
  // Announcements
  'announcements': { en: 'Announcements', hi: 'घोषणाएं' },
  'alerts': { en: 'Alerts', hi: 'अलर्ट' },
  'no_announcements': { en: 'No active announcements', hi: 'कोई सक्रिय घोषणा नहीं' },
  
  // Map Legend
  'legend': { en: 'Legend', hi: 'किंवदंती' },
  
  // Units
  'kmh': { en: 'km/h', hi: 'किमी/घंटा' },
  'km': { en: 'km', hi: 'किमी' },
  'rupees': { en: '₹', hi: '₹' }
};

export const useLanguage = () => {
  const [language, setLanguage] = useState<Language>('en');

  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') as Language;
    if (savedLanguage && ['en', 'hi'].includes(savedLanguage)) {
      setLanguage(savedLanguage);
    }
  }, []);

  const changeLanguage = (newLanguage: Language) => {
    setLanguage(newLanguage);
    localStorage.setItem('language', newLanguage);
  };

  const t = (key: string): string => {
    return translations[key]?.[language] || key;
  };

  return {
    language,
    changeLanguage,
    t
  };
};