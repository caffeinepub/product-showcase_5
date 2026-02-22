import { Link } from '@tanstack/react-router';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useIsAdmin } from '../hooks/useIsAdmin';
import { useLanguage } from '../contexts/LanguageContext';
import { useCart } from '../hooks/useCart';
import LoginButton from './LoginButton';
import LanguageToggle from './LanguageToggle';
import MobileNav from './MobileNav';
import CartDrawer from './CartDrawer';
import { ShoppingBag, Settings, Package } from 'lucide-react';
import { useState } from 'react';

export default function Header() {
  const { identity } = useInternetIdentity();
  const { isAdmin } = useIsAdmin();
  const { t } = useLanguage();
  const { data: cart } = useCart();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const isAuthenticated = !!identity;

  const cartItemCount = cart?.reduce((sum, item) => sum + Number(item.quantity), 0) || 0;

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Link to="/" className="flex items-center space-x-2 group">
              <ShoppingBag className="h-6 w-6 text-primary transition-transform group-hover:scale-110" />
              <span className="font-bold text-lg md:text-xl text-foreground">
                {t('appName')}
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-4">
              {isAuthenticated && (
                <Link
                  to="/my-orders"
                  className="flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium text-foreground hover:bg-accent transition-colors min-h-[44px]"
                >
                  <Package className="h-4 w-4" />
                  <span>{t('myOrders')}</span>
                </Link>
              )}
              
              {isAuthenticated && isAdmin && (
                <Link
                  to="/admin"
                  className="flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium text-foreground hover:bg-accent transition-colors min-h-[44px]"
                >
                  <Settings className="h-4 w-4" />
                  <span>{t('adminPanel')}</span>
                </Link>
              )}
              
              {isAuthenticated && (
                <button
                  onClick={() => setIsCartOpen(true)}
                  className="relative p-2 rounded-lg hover:bg-accent transition-colors min-h-[44px] min-w-[44px]"
                  aria-label="Open cart"
                >
                  <img src="/assets/generated/cart-icon.dim_64x64.png" alt="Cart" className="h-6 w-6" />
                  {cartItemCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                      {cartItemCount}
                    </span>
                  )}
                </button>
              )}
              
              <LanguageToggle />
              <LoginButton />
            </div>

            {/* Mobile Navigation */}
            <div className="flex lg:hidden items-center space-x-2">
              {isAuthenticated && (
                <button
                  onClick={() => setIsCartOpen(true)}
                  className="relative p-2 rounded-lg hover:bg-accent transition-colors min-h-[44px] min-w-[44px]"
                  aria-label="Open cart"
                >
                  <img src="/assets/generated/cart-icon.dim_64x64.png" alt="Cart" className="h-6 w-6" />
                  {cartItemCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                      {cartItemCount}
                    </span>
                  )}
                </button>
              )}
              <MobileNav />
            </div>
          </div>
        </div>
      </header>
      
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
}
