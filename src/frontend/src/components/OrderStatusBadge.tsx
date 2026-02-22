import { OrderStatus } from '../backend';
import { useLanguage } from '../contexts/LanguageContext';

interface OrderStatusBadgeProps {
  status: OrderStatus;
}

export default function OrderStatusBadge({ status }: OrderStatusBadgeProps) {
  const { t } = useLanguage();

  const statusConfig: Record<OrderStatus, { label: string; color: string }> = {
    [OrderStatus.pending]: { label: t('pending'), color: 'bg-yellow-500' },
    [OrderStatus.processing]: { label: t('processing'), color: 'bg-blue-500' },
    [OrderStatus.shipped]: { label: t('shipped'), color: 'bg-purple-500' },
    [OrderStatus.delivered]: { label: t('delivered'), color: 'bg-green-500' },
  };

  const config = statusConfig[status];

  return (
    <span className={`${config.color} text-white px-3 py-1 rounded-full text-xs font-bold`}>
      {config.label}
    </span>
  );
}
