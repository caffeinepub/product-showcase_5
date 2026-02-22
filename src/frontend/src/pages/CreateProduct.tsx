import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useCreateProduct } from '../hooks/useCreateProduct';
import { useLanguage } from '../contexts/LanguageContext';
import { ExternalBlob, ProductCategory } from '../backend';
import { ArrowLeft, Upload, Loader2, Image as ImageIcon } from 'lucide-react';
import { Link } from '@tanstack/react-router';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';

export default function CreateProduct() {
  const navigate = useNavigate();
  const createProduct = useCreateProduct();
  const { t, language } = useLanguage();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [category, setCategory] = useState<ProductCategory>(ProductCategory.electronics);
  const [stock, setStock] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  const currency = language === 'ne' ? 'रू' : '₹';

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!imageFile) {
      alert(t('image') + ' ' + t('required'));
      return;
    }

    try {
      const arrayBuffer = await imageFile.arrayBuffer();
      const uint8Array = new Uint8Array(arrayBuffer);
      const blob = ExternalBlob.fromBytes(uint8Array).withUploadProgress((percentage) => {
        setUploadProgress(percentage);
      });

      await createProduct.mutateAsync({
        name,
        description,
        price: BigInt(price),
        image: blob,
        whatsappNumber,
        category,
        stock: BigInt(stock),
      });

      navigate({ to: '/admin' });
    } catch (error) {
      console.error('Failed to create product:', error);
      alert(t('error'));
    }
  };

  const isSubmitting = createProduct.isPending;

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <div className="max-w-2xl mx-auto space-y-6 sm:space-y-8">
        <div>
          <Link
            to="/admin"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>{t('back')}</span>
          </Link>
          <h1 className="font-serif text-2xl sm:text-3xl md:text-4xl font-semibold">{t('addProduct')}</h1>
        </div>

        <form onSubmit={handleSubmit} className="bg-card rounded-xl shadow-soft p-4 sm:p-6 md:p-8 space-y-4 sm:space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">{t('productName')} *</Label>
            <Input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder={t('productName')}
              className="min-h-[48px]"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">{t('description')} *</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              rows={4}
              placeholder={t('description')}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">{t('price')} ({currency}) *</Label>
              <Input
                id="price"
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
                min="0"
                step="1"
                placeholder="0"
                className="min-h-[48px]"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="stock">{t('stock')} *</Label>
              <Input
                id="stock"
                type="number"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                required
                min="0"
                step="1"
                placeholder="0"
                className="min-h-[48px]"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">{t('category')} *</Label>
            <Select value={category} onValueChange={(value) => setCategory(value as ProductCategory)}>
              <SelectTrigger className="min-h-[48px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ProductCategory.electronics}>{t('electronics')}</SelectItem>
                <SelectItem value={ProductCategory.clothing}>{t('clothing')}</SelectItem>
                <SelectItem value={ProductCategory.home}>{t('homeKitchen')}</SelectItem>
                <SelectItem value={ProductCategory.books}>{t('beautyPersonalCare')}</SelectItem>
                <SelectItem value={ProductCategory.sports}>{t('sportsOutdoors')}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="whatsapp">{t('whatsappNumber')} *</Label>
            <Input
              id="whatsapp"
              type="tel"
              value={whatsappNumber}
              onChange={(e) => setWhatsappNumber(e.target.value)}
              required
              placeholder="+977 1234567890"
              className="min-h-[48px]"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="image">{t('image')} *</Label>
            <div className="space-y-4">
              {imagePreview ? (
                <div className="relative aspect-square w-full max-w-sm mx-auto rounded-lg overflow-hidden bg-muted">
                  <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => {
                      setImageFile(null);
                      setImagePreview(null);
                    }}
                    className="absolute top-2 right-2 px-3 py-1.5 bg-background/90 hover:bg-background rounded-lg text-sm font-medium transition-colors"
                  >
                    {t('cancel')}
                  </button>
                </div>
              ) : (
                <label
                  htmlFor="image"
                  className="flex flex-col items-center justify-center w-full aspect-square max-w-sm mx-auto border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted/50 transition-colors"
                >
                  <div className="flex flex-col items-center justify-center py-8">
                    <ImageIcon className="h-12 w-12 text-muted-foreground mb-3" />
                    <p className="text-sm font-medium mb-1">{t('image')}</p>
                  </div>
                  <input
                    id="image"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
              )}

              {uploadProgress > 0 && uploadProgress < 100 && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">{t('loading')}</span>
                    <span className="font-medium">{uploadProgress}%</span>
                  </div>
                  <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 min-h-[48px]"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin mr-2" />
                  {t('creating')}
                </>
              ) : (
                <>
                  <Upload className="h-5 w-5 mr-2" />
                  {t('create')}
                </>
              )}
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => navigate({ to: '/admin' })}
              className="min-h-[48px]"
            >
              {t('cancel')}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
