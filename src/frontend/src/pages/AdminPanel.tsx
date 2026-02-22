import { Link } from '@tanstack/react-router';
import { useProducts } from '../hooks/useProducts';
import { useDeleteProduct } from '../hooks/useDeleteProduct';
import { useLowStockProducts } from '../hooks/useLowStockProducts';
import { useLanguage } from '../contexts/LanguageContext';
import { Loader2, Plus, Edit, Trash2, Package, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import CategoryBadge from '../components/CategoryBadge';

export default function AdminPanel() {
  const { data: products, isLoading } = useProducts();
  const { data: lowStockProducts } = useLowStockProducts(BigInt(5));
  const deleteProduct = useDeleteProduct();
  const { t, language } = useLanguage();
  const currency = language === 'ne' ? 'रू' : '₹';

  const handleDelete = async (id: string, name: string) => {
    if (window.confirm(`${t('deleteProduct')} "${name}"?`)) {
      try {
        await deleteProduct.mutateAsync(id);
      } catch (error) {
        console.error('Failed to delete product:', error);
        alert(t('error'));
      }
    }
  };

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
          <h1 className="font-serif text-2xl sm:text-3xl md:text-4xl font-semibold">{t('manageProducts')}</h1>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link to="/admin/orders">
              <Button variant="outline" className="w-full sm:w-auto min-h-[44px]">
                <Package className="h-4 w-4 mr-2" />
                {t('manageOrders')}
              </Button>
            </Link>
            <Link to="/admin/create">
              <Button className="w-full sm:w-auto min-h-[44px]">
                <Plus className="h-4 w-4 mr-2" />
                {t('addProduct')}
              </Button>
            </Link>
          </div>
        </div>

        {lowStockProducts && lowStockProducts.length > 0 && (
          <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-yellow-900 dark:text-yellow-100">{t('lowStockAlert')}</h3>
                <p className="text-sm text-yellow-800 dark:text-yellow-200 mt-1">
                  {lowStockProducts.length} {t('productsLowStock')}
                </p>
              </div>
            </div>
          </div>
        )}

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
                    <TableHead className="hidden md:table-cell">{t('category')}</TableHead>
                    <TableHead>{t('price')}</TableHead>
                    <TableHead>{t('stock')}</TableHead>
                    <TableHead className="text-right">{t('actions')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {products.map((product) => {
                    const stock = Number(product.stock);
                    const isLowStock = stock > 0 && stock < 5;
                    const isOutOfStock = stock === 0;

                    return (
                      <TableRow key={product.id}>
                        <TableCell>
                          <img
                            src={product.image.getDirectURL()}
                            alt={product.name}
                            className="w-16 h-16 object-cover rounded-lg"
                          />
                        </TableCell>
                        <TableCell className="font-medium">{product.name}</TableCell>
                        <TableCell className="hidden md:table-cell">
                          <CategoryBadge category={product.category} />
                        </TableCell>
                        <TableCell className="font-semibold">
                          {currency}{Number(product.price).toLocaleString()}
                        </TableCell>
                        <TableCell>
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-bold ${
                              isOutOfStock
                                ? 'bg-destructive/10 text-destructive'
                                : isLowStock
                                ? 'bg-yellow-500/10 text-yellow-600'
                                : 'bg-green-500/10 text-green-600'
                            }`}
                          >
                            {isOutOfStock && <AlertCircle className="h-3 w-3" />}
                            {isLowStock && <AlertCircle className="h-3 w-3" />}
                            {stock}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Link to="/admin/edit/$id" params={{ id: product.id }}>
                              <Button variant="ghost" size="sm" className="min-h-[36px] min-w-[36px]">
                                <Edit className="h-4 w-4" />
                              </Button>
                            </Link>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(product.id, product.name)}
                              disabled={deleteProduct.isPending}
                              className="text-destructive hover:text-destructive hover:bg-destructive/10 min-h-[36px] min-w-[36px]"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
