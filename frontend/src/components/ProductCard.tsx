import { type Product } from '../backend';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useLanguage } from '../contexts/LanguageContext';
import WhatsAppButton from './WhatsAppButton';
import AddToCartButton from './AddToCartButton';
import CategoryBadge from './CategoryBadge';
import { Package, AlertCircle } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { identity } = useInternetIdentity();
  const { t, language } = useLanguage();
  const imageUrl = product.image.getDirectURL();
  const price = Number(product.price);
  const stock = Number(product.stock);
  const isAuthenticated = !!identity;
  const currency = language === 'ne' ? 'रू' : '₹';

  const isOutOfStock = stock === 0;
  const isLowStock = stock > 0 && stock < 5;

  return (
    <article className="group bg-card rounded-xl overflow-hidden shadow-soft hover:shadow-elegant transition-all duration-300 hover:-translate-y-1">
      <div className="aspect-square overflow-hidden bg-muted relative">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Package className="h-16 w-16 text-muted-foreground/30" />
          </div>
        )}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
            <span className="bg-destructive text-destructive-foreground px-4 py-2 rounded-lg font-bold">
              {t('outOfStock')}
            </span>
          </div>
        )}
        <div className="absolute top-2 left-2">
          <CategoryBadge category={product.category} />
        </div>
        {isLowStock && !isOutOfStock && (
          <div className="absolute top-2 right-2 bg-yellow-500 text-white px-2 py-1 rounded text-xs font-bold flex items-center gap-1">
            <AlertCircle className="h-3 w-3" />
            {t('lowStock')}
          </div>
        )}
      </div>
      
      <div className="p-4 sm:p-6 space-y-3 sm:space-y-4">
        <div className="space-y-2">
          <h3 className="font-serif text-lg sm:text-xl font-semibold text-foreground line-clamp-2">
            {product.name}
          </h3>
          <p className="text-muted-foreground text-xs sm:text-sm line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        </div>

        <div className="flex items-baseline justify-between pt-2 border-t">
          <div>
            <span className="text-xl sm:text-2xl font-bold text-primary">{currency}{price.toLocaleString()}</span>
          </div>
        </div>

        {isAuthenticated ? (
          <AddToCartButton productId={product.id} stock={product.stock} />
        ) : (
          <WhatsAppButton
            productName={product.name}
            whatsappNumber={product.whatsappNumber}
          />
        )}
      </div>
    </article>
  );
}
