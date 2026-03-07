import { useState } from 'react';
import { Trash2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { useDeleteProduct } from '../hooks/useDeleteProduct';
import { useLanguage } from '../contexts/LanguageContext';
import { toast } from 'sonner';

interface DeleteProductDialogProps {
  productId: string;
  productName: string;
}

export default function DeleteProductDialog({ productId, productName }: DeleteProductDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const deleteProduct = useDeleteProduct();
  const { t } = useLanguage();

  const handleDelete = async () => {
    try {
      await deleteProduct.mutateAsync(productId);
      toast.success(t('productDeleted'));
      setIsOpen(false);
    } catch (error) {
      console.error('Failed to delete product:', error);
      toast.error(t('error'));
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="text-destructive hover:text-destructive hover:bg-destructive/10 min-h-[36px] min-w-[36px]"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t('deleteProductConfirm')}</AlertDialogTitle>
          <AlertDialogDescription>
            {t('deleteProductWarning')} <strong>{productName}</strong>. {t('actionCannotBeUndone')}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={deleteProduct.isPending}>
            {t('cancel')}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={deleteProduct.isPending}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {deleteProduct.isPending ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                {t('deleting')}
              </>
            ) : (
              t('deleteProduct')
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
