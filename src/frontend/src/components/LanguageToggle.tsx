import { useLanguage } from '../contexts/LanguageContext';
import { Languages } from 'lucide-react';

export default function LanguageToggle() {
  const { language, toggleLanguage } = useLanguage();

  return (
    <button
      onClick={toggleLanguage}
      className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium hover:bg-accent transition-colors"
      aria-label="Toggle language"
    >
      <Languages className="h-4 w-4" />
      <span className="hidden sm:inline">{language === 'en' ? 'English' : 'नेपाली'}</span>
    </button>
  );
}
