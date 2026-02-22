import { Link } from '@tanstack/react-router';
import { useLanguage } from '../contexts/LanguageContext';
import { useTotalProducts } from '../hooks/useTotalProducts';
import { useTotalOrders } from '../hooks/useTotalOrders';
import { usePendingOrders } from '../hooks/usePendingOrders';
import { useLowStockCount } from '../hooks/useLowStockCount';
import { useTotalRevenue } from '../hooks/useTotalRevenue';
import { useAllOrders } from '../hooks/useAllOrders';
import OrderStatusBadge from '../components/OrderStatusBadge';
import { Loader2, Package, ShoppingCart, Clock, AlertTriangle, DollarSign, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function AdminDashboard() {
  const { t, language } = useLanguage();
  const currency = language === 'ne' ? 'रू' : '₹';

  const { data: totalProducts, isLoading: loadingProducts } = useTotalProducts();
  const { data: totalOrders, isLoading: loadingOrders } = useTotalOrders();
  const { data: pendingOrders, isLoading: loadingPending } = usePendingOrders();
  const { data: lowStockCount, isLoading: loadingLowStock } = useLowStockCount();
  const { data: totalRevenue, isLoading: loadingRevenue } = useTotalRevenue();
  const { data: allOrders, isLoading: loadingAllOrders } = useAllOrders();

  const isLoading = loadingProducts || loadingOrders || loadingPending || loadingLowStock || loadingRevenue;

  // Get 5 most recent orders
  const recentOrders = allOrders
    ? [...allOrders]
        .sort((a, b) => Number(b.timestamp) - Number(a.timestamp))
        .slice(0, 5)
    : [];

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-center py-16">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  const metrics = [
    {
      title: t('totalProducts'),
      value: totalProducts !== undefined ? Number(totalProducts) : 0,
      icon: Package,
      color: 'text-blue-600',
      bgColor: 'bg-blue-500/10',
    },
    {
      title: t('totalOrders'),
      value: totalOrders !== undefined ? Number(totalOrders) : 0,
      icon: ShoppingCart,
      color: 'text-green-600',
      bgColor: 'bg-green-500/10',
    },
    {
      title: t('pendingOrders'),
      value: pendingOrders !== undefined ? Number(pendingOrders) : 0,
      icon: Clock,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-500/10',
    },
    {
      title: t('lowStockItems'),
      value: lowStockCount !== undefined ? Number(lowStockCount) : 0,
      icon: AlertTriangle,
      color: 'text-orange-600',
      bgColor: 'bg-orange-500/10',
    },
    {
      title: t('totalRevenue'),
      value: totalRevenue !== undefined ? `${currency}${Number(totalRevenue).toLocaleString()}` : `${currency}0`,
      icon: DollarSign,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-500/10',
      isRevenue: true,
    },
  ];

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h1 className="font-serif text-2xl sm:text-3xl md:text-4xl font-semibold">{t('dashboard')}</h1>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 sm:gap-6">
          {metrics.map((metric) => {
            const Icon = metric.icon;
            return (
              <Card key={metric.title} className="shadow-soft hover:shadow-elegant transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {metric.title}
                  </CardTitle>
                  <div className={`p-2 rounded-lg ${metric.bgColor}`}>
                    <Icon className={`h-5 w-5 ${metric.color}`} />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {metric.isRevenue ? metric.value : metric.value.toLocaleString()}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Recent Orders Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-xl sm:text-2xl font-semibold">{t('recentOrders')}</h2>
            <Link to="/admin/orders">
              <Button variant="outline" size="sm" className="min-h-[36px]">
                {t('viewAllOrders')}
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </div>

          {loadingAllOrders ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : !recentOrders || recentOrders.length === 0 ? (
            <Card className="shadow-soft">
              <CardContent className="py-12">
                <div className="text-center space-y-2">
                  <ShoppingCart className="h-12 w-12 text-muted-foreground/30 mx-auto" />
                  <p className="text-muted-foreground">{t('noOrdersYet')}</p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {recentOrders.map((order) => (
                <Link
                  key={order.id}
                  to="/admin/order/$orderId"
                  params={{ orderId: order.id }}
                >
                  <Card className="shadow-soft hover:shadow-elegant transition-all cursor-pointer">
                    <CardContent className="p-4 sm:p-6">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="space-y-2 flex-1">
                          <div className="flex items-center gap-3 flex-wrap">
                            <span className="font-mono text-sm font-bold truncate max-w-[200px]">
                              {order.id}
                            </span>
                            <OrderStatusBadge status={order.status} />
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {t('customerName')}: <span className="font-medium">{order.shippingDetails.name}</span>
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-primary">
                            {currency}{Number(order.total).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
