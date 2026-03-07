import { useParams, useNavigate } from '@tanstack/react-router';
import { useOrder } from '../hooks/useOrder';
import { useUpdateOrderStatus } from '../hooks/useUpdateOrderStatus';
import { useLanguage } from '../contexts/LanguageContext';
import { OrderStatus } from '../backend';
import OrderStatusBadge from '../components/OrderStatusBadge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, ArrowLeft, MapPin, User, Phone } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminOrderDetails() {
  const { orderId } = useParams({ from: '/admin/order/$orderId' });
  const navigate = useNavigate();
  const { data: order, isLoading } = useOrder(orderId);
  const updateStatus = useUpdateOrderStatus();
  const { t, language } = useLanguage();
  const currency = language === 'ne' ? 'रू' : '₹';

  const handleStatusUpdate = async (newStatus: OrderStatus) => {
    try {
      await updateStatus.mutateAsync({ orderId, status: newStatus });
      toast.success(t('success'));
    } catch (error) {
      toast.error(t('error'));
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12 flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <p className="text-destructive text-lg">{t('error')}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <div className="max-w-4xl mx-auto space-y-6 sm:space-y-8">
        <div>
          <Button
            variant="ghost"
            onClick={() => navigate({ to: '/admin/orders' })}
            className="mb-4 min-h-[44px]"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            {t('backToOrders')}
          </Button>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h1 className="font-serif text-2xl sm:text-3xl md:text-4xl font-semibold">{t('orderDetails')}</h1>
            <OrderStatusBadge status={order.status} />
          </div>
        </div>

        {/* Update Status */}
        <div className="bg-card rounded-xl shadow-soft p-4 sm:p-6 space-y-4">
          <h2 className="text-lg sm:text-xl font-bold">{t('updateStatus')}</h2>
          <Select
            value={order.status}
            onValueChange={(value) => handleStatusUpdate(value as OrderStatus)}
            disabled={updateStatus.isPending}
          >
            <SelectTrigger className="w-full min-h-[48px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={OrderStatus.pending}>{t('pending')}</SelectItem>
              <SelectItem value={OrderStatus.processing}>{t('processing')}</SelectItem>
              <SelectItem value={OrderStatus.shipped}>{t('shipped')}</SelectItem>
              <SelectItem value={OrderStatus.delivered}>{t('delivered')}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Order Information */}
        <div className="bg-card rounded-xl shadow-soft p-4 sm:p-6 space-y-4">
          <h2 className="text-lg sm:text-xl font-bold">{t('orderInformation')}</h2>
          <div className="space-y-3">
            <div className="flex justify-between py-2 border-b">
              <span className="text-muted-foreground">{t('orderId')}</span>
              <span className="font-mono font-bold text-sm">{order.id}</span>
            </div>
            <div className="flex justify-between py-2 border-b">
              <span className="text-muted-foreground">{t('total')}</span>
              <span className="font-bold text-primary text-lg">{currency}{Number(order.total).toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Customer Information */}
        <div className="bg-card rounded-xl shadow-soft p-4 sm:p-6 space-y-4">
          <h2 className="text-lg sm:text-xl font-bold">{t('shippingInformation')}</h2>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <User className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm text-muted-foreground">{t('fullName')}</p>
                <p className="font-medium">{order.shippingDetails.name}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Phone className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm text-muted-foreground">{t('phoneNumber')}</p>
                <p className="font-medium">{order.shippingDetails.phone}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm text-muted-foreground">{t('deliveryAddress')}</p>
                <p className="font-medium">{order.shippingDetails.address}</p>
                <p className="font-medium">{order.shippingDetails.city}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Ordered Items */}
        <div className="bg-card rounded-xl shadow-soft p-4 sm:p-6 space-y-4">
          <h2 className="text-lg sm:text-xl font-bold">{t('orderedItems')}</h2>
          <div className="space-y-4">
            {order.items.map((item) => (
              <div key={item.product.id} className="flex gap-4 pb-4 border-b last:border-0">
                <img
                  src={item.product.image.getDirectURL()}
                  alt={item.product.name}
                  className="w-20 h-20 object-cover rounded-lg"
                />
                <div className="flex-1">
                  <h3 className="font-medium">{item.product.name}</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {t('quantity')}: {Number(item.quantity)}
                  </p>
                  <p className="text-sm font-bold text-primary mt-1">
                    {currency}{(Number(item.product.price) * Number(item.quantity)).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
