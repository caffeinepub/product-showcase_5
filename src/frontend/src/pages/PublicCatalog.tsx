import { useProducts } from '../hooks/useProducts';
import ProductGrid from '../components/ProductGrid';
import { Loader2, Package } from 'lucide-react';

export default function PublicCatalog() {
  const { data: products, isLoading, error } = useProducts();

  return (
    <div className="min-h-screen">
      {/* Hero Banner */}
      <section className="relative w-full h-[400px] md:h-[500px] lg:h-[600px] overflow-hidden">
        <img
          src="/assets/generated/hero-banner.dim_1920x600.png"
          alt="Product Showcase"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/40 to-transparent" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center space-y-4 px-4">
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-white drop-shadow-lg">
              Discover Our Collection
            </h1>
            <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto drop-shadow">
              Explore our curated selection of premium products
            </p>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="space-y-8">
          <div className="text-center space-y-3">
            <h2 className="font-serif text-3xl md:text-4xl font-semibold">Our Products</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Browse through our carefully selected products. Contact us directly via WhatsApp for any inquiries.
            </p>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-16">
              <div className="text-center space-y-4">
                <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
                <p className="text-muted-foreground">Loading products...</p>
              </div>
            </div>
          ) : error ? (
            <div className="text-center py-16">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-destructive/10 mb-4">
                <Package className="h-8 w-8 text-destructive" />
              </div>
              <p className="text-destructive text-lg">Failed to load products. Please try again later.</p>
            </div>
          ) : (
            <ProductGrid products={products || []} />
          )}
        </div>
      </section>
    </div>
  );
}
