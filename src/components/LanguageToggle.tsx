import React from 'react';
import { Button } from '@/components/ui/button';
import { Languages } from 'lucide-react';
import { useLanguage, Language } from '@/hooks/useLanguage';

const LanguageToggle: React.FC = () => {
  const { language, changeLanguage } = useLanguage();

  const toggleLanguage = () => {
    changeLanguage(language === 'en' ? 'hi' : 'en');
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={toggleLanguage}
      className="flex items-center gap-2"
    >
      <Languages className="w-4 h-4" />
      {language === 'en' ? 'हिं' : 'EN'}
    </Button>
  );
};

export default LanguageToggle;