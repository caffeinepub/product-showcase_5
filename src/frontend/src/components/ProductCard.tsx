import { type Product } from '../backend';
import WhatsAppButton from './WhatsAppButton';
import { Package } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const imageUrl = product.image.getDirectURL();
  const price = Number(product.price);

  return (
    <article className="group bg-card rounded-xl overflow-hidden shadow-soft hover:shadow-elegant transition-all duration-300 animate-fade-in">
      <div className="aspect-square overflow-hidden bg-muted">
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
      </div>
      
      <div className="p-6 space-y-4">
        <div className="space-y-2">
          <h3 className="font-serif text-xl font-semibold text-foreground line-clamp-2">
            {product.name}
          </h3>
          <p className="text-muted-foreground text-sm line-clamp-3 leading-relaxed">
            {product.description}
          </p>
        </div>

        <div className="flex items-baseline justify-between pt-2 border-t">
          <div>
            <span className="text-2xl font-bold text-primary">₹{price.toLocaleString()}</span>
          </div>
        </div>

        <WhatsAppButton
          productName={product.name}
          whatsappNumber={product.whatsappNumber}
        />
      </div>
    </article>
  );
}
