import { Link } from '@tanstack/react-router';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useIsAdmin } from '../hooks/useIsAdmin';
import LoginButton from './LoginButton';
import { ShoppingBag, Settings } from 'lucide-react';

export default function Header() {
  const { identity } = useInternetIdentity();
  const { isAdmin } = useIsAdmin();
  const isAuthenticated = !!identity;

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center space-x-2 group">
            <ShoppingBag className="h-6 w-6 text-primary transition-transform group-hover:scale-110" />
            <span className="font-serif text-xl font-semibold text-foreground">
              Product Showcase
            </span>
          </Link>

          <div className="flex items-center space-x-4">
            {isAuthenticated && isAdmin && (
              <Link
                to="/admin"
                className="flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium text-foreground hover:bg-accent transition-colors"
              >
                <Settings className="h-4 w-4" />
                <span className="hidden sm:inline">Admin Panel</span>
              </Link>
            )}
            <LoginButton />
          </div>
        </div>
      </div>
    </header>
  );
}
