import { useState, useMemo } from 'react';
import { useProducts } from '../hooks/useProducts';
import { useLanguage } from '../contexts/LanguageContext';
import { ProductCategory } from '../backend';
import ProductGrid from '../components/ProductGrid';
import ProductSearch from '../components/ProductSearch';
import CategoryFilter from '../components/CategoryFilter';
import { ProductGridSkeleton } from '../components/LoadingSkeleton';
import { Package } from 'lucide-react';

export default function PublicCatalog() {
  const { data: products, isLoading, error } = useProducts();
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | null>(null);

  const filteredProducts = useMemo(() => {
    if (!products) return [];

    let filtered = products;

    // Filter by category
    if (selectedCategory !== null) {
      filtered = filtered.filter((p) => p.category === selectedCategory);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [products, selectedCategory, searchQuery]);

  return (
    <div className="min-h-screen">
      {/* Hero Banner */}
      <section className="relative w-full h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px] overflow-hidden">
        <picture>
          <source media="(max-width: 768px)" srcSet="/assets/generated/hero-mobile.dim_800x400.png" />
          <img
            src="/assets/generated/hero-banner.dim_1920x600.png"
            alt={t('appName')}
            className="w-full h-full object-cover"
          />
        </picture>
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/40 to-transparent" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center space-y-4 px-4">
            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white drop-shadow-lg">
              {t('discoverCollection')}
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-white/90 max-w-2xl mx-auto drop-shadow">
              {t('exploreProducts')}
            </p>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
        <div className="space-y-6 sm:space-y-8">
          <div className="text-center space-y-3">
            <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-semibold">{t('ourProducts')}</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-sm sm:text-base">
              {t('browseProducts')}
            </p>
          </div>

          {/* Search and Filter */}
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <ProductSearch onSearch={setSearchQuery} />
            <CategoryFilter selectedCategory={selectedCategory} onSelectCategory={setSelectedCategory} />
          </div>

          {isLoading ? (
            <ProductGridSkeleton />
          ) : error ? (
            <div className="text-center py-16">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-destructive/10 mb-4">
                <Package className="h-8 w-8 text-destructive" />
              </div>
              <p className="text-destructive text-lg">{t('error')}</p>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-16">
              <Package className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
              <p className="text-muted-foreground text-lg">{t('noProductsFound')}</p>
            </div>
          ) : (
            <ProductGrid products={filteredProducts} />
          )}
        </div>
      </section>
    </div>
  );
}
