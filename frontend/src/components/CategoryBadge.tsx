import { ProductCategory } from '../backend';
import { useLanguage } from '../contexts/LanguageContext';

interface CategoryBadgeProps {
  category: ProductCategory;
}

export default function CategoryBadge({ category }: CategoryBadgeProps) {
  const { t } = useLanguage();

  const categoryConfig: Record<ProductCategory, { label: string; color: string }> = {
    [ProductCategory.electronics]: { label: t('electronics'), color: 'bg-blue-500' },
    [ProductCategory.clothing]: { label: t('clothing'), color: 'bg-purple-500' },
    [ProductCategory.home]: { label: t('homeKitchen'), color: 'bg-green-500' },
    [ProductCategory.books]: { label: t('beautyPersonalCare'), color: 'bg-pink-500' },
    [ProductCategory.sports]: { label: t('sportsOutdoors'), color: 'bg-orange-500' },
  };

  const config = categoryConfig[category];

  return (
    <span className={`${config.color} text-white px-2 py-1 rounded text-xs font-bold`}>
      {config.label}
    </span>
  );
}
