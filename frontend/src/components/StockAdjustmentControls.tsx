import { useState } from 'react';
import { Minus, Plus, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useUpdateStock } from '../hooks/useUpdateStock';
import { toast } from 'sonner';
import { useLanguage } from '../contexts/LanguageContext';

interface StockAdjustmentControlsProps {
  productId: string;
  currentStock: number;
}

export default function StockAdjustmentControls({ productId, currentStock }: StockAdjustmentControlsProps) {
  const [localStock, setLocalStock] = useState(currentStock);
  const updateStock = useUpdateStock();
  const { t } = useLanguage();

  const handleStockChange = async (newStock: number) => {
    if (newStock < 0) return;
    
    setLocalStock(newStock);
    
    try {
      await updateStock.mutateAsync({ productId, stock: BigInt(newStock) });
      toast.success(t('stockUpdated'));
    } catch (error) {
      console.error('Failed to update stock:', error);
      toast.error(t('error'));
      setLocalStock(currentStock);
    }
  };

  const increment = () => handleStockChange(localStock + 1);
  const decrement = () => {
    if (localStock > 0) {
      handleStockChange(localStock - 1);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value) && value >= 0) {
      handleStockChange(value);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={decrement}
        disabled={localStock === 0 || updateStock.isPending}
        className="h-8 w-8 p-0"
      >
        {updateStock.isPending ? (
          <Loader2 className="h-3 w-3 animate-spin" />
        ) : (
          <Minus className="h-3 w-3" />
        )}
      </Button>
      
      <Input
        type="number"
        value={localStock}
        onChange={handleInputChange}
        disabled={updateStock.isPending}
        className="h-8 w-16 text-center"
        min="0"
      />
      
      <Button
        variant="outline"
        size="sm"
        onClick={increment}
        disabled={updateStock.isPending}
        className="h-8 w-8 p-0"
      >
        {updateStock.isPending ? (
          <Loader2 className="h-3 w-3 animate-spin" />
        ) : (
          <Plus className="h-3 w-3" />
        )}
      </Button>
    </div>
  );
}
