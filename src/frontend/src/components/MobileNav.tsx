import { useState } from 'react';
import { Link } from '@tanstack/react-router';
import { Menu, X, ShoppingBag, Package, Settings, LayoutDashboard } from 'lucide-react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useIsAdmin } from '../hooks/useIsAdmin';
import { useLanguage } from '../contexts/LanguageContext';
import LoginButton from './LoginButton';
import LanguageToggle from './LanguageToggle';

export default function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);
  const { identity } = useInternetIdentity();
  const { isAdmin } = useIsAdmin();
  const { t } = useLanguage();
  const isAuthenticated = !!identity;

  return (
    <div className="lg:hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-lg hover:bg-accent transition-colors"
        aria-label="Toggle menu"
      >
        {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="fixed top-16 left-0 right-0 bg-card border-b shadow-lg z-50 animate-slide-down">
            <nav className="container mx-auto px-4 py-4 space-y-2">
              <Link
                to="/"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-accent transition-colors"
              >
                <ShoppingBag className="h-5 w-5" />
                <span className="font-medium">{t('ourProducts')}</span>
              </Link>
              
              {isAuthenticated && (
                <Link
                  to="/my-orders"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-accent transition-colors"
                >
                  <Package className="h-5 w-5" />
                  <span className="font-medium">{t('myOrders')}</span>
                </Link>
              )}
              
              {isAuthenticated && isAdmin && (
                <>
                  <Link
                    to="/admin/dashboard"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-accent transition-colors"
                  >
                    <LayoutDashboard className="h-5 w-5" />
                    <span className="font-medium">{t('dashboard')}</span>
                  </Link>
                  <Link
                    to="/admin"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-accent transition-colors"
                  >
                    <Settings className="h-5 w-5" />
                    <span className="font-medium">{t('adminPanel')}</span>
                  </Link>
                </>
              )}
              
              <div className="flex items-center gap-2 px-4 py-2">
                <LanguageToggle />
                <LoginButton />
              </div>
            </nav>
          </div>
        </>
      )}
    </div>
  );
}
