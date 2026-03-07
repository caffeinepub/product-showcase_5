import { Link } from '@tanstack/react-router';
import { useProducts } from '../hooks/useProducts';
import { useLanguage } from '../contexts/LanguageContext';
import { Loader2, Plus, Edit, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import CategoryBadge from '../components/CategoryBadge';
import StockAdjustmentControls from '../components/StockAdjustmentControls';
import DeleteProductDialog from '../components/DeleteProductDialog';

export default function ProductManagement() {
  const { data: products, isLoading } = useProducts();
  const { t, language } = useLanguage();
  const currency = language === 'ne' ? 'रू' : '₹';

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-center py-16">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h1 className="font-serif text-2xl sm:text-3xl md:text-4xl font-semibold">{t('productManagement')}</h1>
          <Link to="/admin/create">
            <Button className="w-full sm:w-auto min-h-[44px]">
              <Plus className="h-4 w-4 mr-2" />
              {t('addProduct')}
            </Button>
          </Link>
        </div>

        {!products || products.length === 0 ? (
          <div className="text-center py-16 space-y-4">
            <Package className="h-16 w-16 text-muted-foreground/30 mx-auto" />
            <p className="text-muted-foreground text-lg">{t('noProductsFound')}</p>
            <Link to="/admin/create">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                {t('addProduct')}
              </Button>
            </Link>
          </div>
        ) : (
          <div className="bg-card rounded-xl shadow-soft overflow-hidden">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-20">{t('image')}</TableHead>
                    <TableHead>{t('productName')}</TableHead>
                    <TableHead className="hidden lg:table-cell">{t('description')}</TableHead>
                    <TableHead>{t('price')}</TableHead>
                    <TableHead className="hidden md:table-cell">{t('category')}</TableHead>
                    <TableHead>{t('stockManagement')}</TableHead>
                    <TableHead className="text-right">{t('actions')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {products.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell>
                        <img
                          src={product.image.getDirectURL()}
                          alt={product.name}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                      </TableCell>
                      <TableCell className="font-medium">{product.name}</TableCell>
                      <TableCell className="hidden lg:table-cell max-w-xs truncate">
                        {product.description}
                      </TableCell>
                      <TableCell className="font-semibold whitespace-nowrap">
                        {currency}{Number(product.price).toLocaleString()}
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <CategoryBadge category={product.category} />
                      </TableCell>
                      <TableCell>
                        <StockAdjustmentControls
                          productId={product.id}
                          currentStock={Number(product.stock)}
                        />
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link to="/admin/edit/$id" params={{ id: product.id }}>
                            <Button variant="ghost" size="sm" className="min-h-[36px] min-w-[36px]">
                              <Edit className="h-4 w-4" />
                            </Button>
                          </Link>
                          <DeleteProductDialog productId={product.id} productName={product.name} />
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
