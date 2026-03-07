import { ProductCategory } from '../backend';
import { useLanguage } from '../contexts/LanguageContext';

interface CategoryFilterProps {
  selectedCategory: ProductCategory | null;
  onSelectCategory: (category: ProductCategory | null) => void;
}

export default function CategoryFilter({ selectedCategory, onSelectCategory }: CategoryFilterProps) {
  const { t } = useLanguage();

  const categories: Array<{ value: ProductCategory | null; label: string }> = [
    { value: null, label: t('allCategories') },
    { value: ProductCategory.electronics, label: t('electronics') },
    { value: ProductCategory.clothing, label: t('clothing') },
    { value: ProductCategory.home, label: t('homeKitchen') },
    { value: ProductCategory.books, label: t('beautyPersonalCare') },
    { value: ProductCategory.sports, label: t('sportsOutdoors') },
  ];

  return (
    <div className="flex flex-wrap gap-2">
      {categories.map((cat) => (
        <button
          key={cat.value || 'all'}
          onClick={() => onSelectCategory(cat.value)}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all min-h-[44px] ${
            selectedCategory === cat.value
              ? 'bg-primary text-primary-foreground shadow-md'
              : 'bg-muted hover:bg-muted/80 text-foreground'
          }`}
        >
          {cat.label}
        </button>
      ))}
    </div>
  );
}
