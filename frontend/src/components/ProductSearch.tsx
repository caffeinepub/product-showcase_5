import { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { Search, X } from 'lucide-react';

interface ProductSearchProps {
  onSearch: (query: string) => void;
}

export default function ProductSearch({ onSearch }: ProductSearchProps) {
  const [query, setQuery] = useState('');
  const { t } = useLanguage();

  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(query);
    }, 300);

    return () => clearTimeout(timer);
  }, [query, onSearch]);

  return (
    <div className="relative max-w-md w-full">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={t('searchPlaceholder')}
        className="w-full pl-10 pr-10 py-3 rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-ring min-h-[48px]"
      />
      {query && (
        <button
          onClick={() => setQuery('')}
          className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded hover:bg-muted transition-colors"
          aria-label="Clear search"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
