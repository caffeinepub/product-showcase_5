import { RouterProvider, createRouter, createRoute, createRootRoute, Outlet } from '@tanstack/react-router';
import { ThemeProvider } from 'next-themes';
import { Toaster } from '@/components/ui/sonner';
import { LanguageProvider } from './contexts/LanguageContext';
import Header from './components/Header';
import Footer from './components/Footer';
import PublicCatalog from './pages/PublicCatalog';
import AdminPanel from './pages/AdminPanel';
import AdminDashboard from './pages/AdminDashboard';
import CreateProduct from './pages/CreateProduct';
import EditProduct from './pages/EditProduct';
import Checkout from './pages/Checkout';
import OrderConfirmation from './pages/OrderConfirmation';
import MyOrders from './pages/MyOrders';
import OrderDetails from './pages/OrderDetails';
import AdminOrders from './pages/AdminOrders';
import AdminOrderDetails from './pages/AdminOrderDetails';
import AdminGuard from './components/AdminGuard';
import ProfileSetupModal from './components/ProfileSetupModal';
import PageTransition from './components/PageTransition';

function Layout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <ProfileSetupModal />
    </div>
  );
}

const rootRoute = createRootRoute({
  component: Layout,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: () => (
    <PageTransition>
      <PublicCatalog />
    </PageTransition>
  ),
});

const checkoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/checkout',
  component: () => (
    <PageTransition>
      <Checkout />
    </PageTransition>
  ),
});

const orderConfirmationRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/order-confirmation/$orderId',
  component: () => (
    <PageTransition>
      <OrderConfirmation />
    </PageTransition>
  ),
});

const myOrdersRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/my-orders',
  component: () => (
    <PageTransition>
      <MyOrders />
    </PageTransition>
  ),
});

const orderDetailsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/order/$orderId',
  component: () => (
    <PageTransition>
      <OrderDetails />
    </PageTransition>
  ),
});

const adminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin',
  component: () => (
    <AdminGuard>
      <PageTransition>
        <AdminPanel />
      </PageTransition>
    </AdminGuard>
  ),
});

const adminDashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin/dashboard',
  component: () => (
    <AdminGuard>
      <PageTransition>
        <AdminDashboard />
      </PageTransition>
    </AdminGuard>
  ),
});

const createProductRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin/create',
  component: () => (
    <AdminGuard>
      <PageTransition>
        <CreateProduct />
      </PageTransition>
    </AdminGuard>
  ),
});

const editProductRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin/edit/$id',
  component: () => (
    <AdminGuard>
      <PageTransition>
        <EditProduct />
      </PageTransition>
    </AdminGuard>
  ),
});

const adminOrdersRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin/orders',
  component: () => (
    <AdminGuard>
      <PageTransition>
        <AdminOrders />
      </PageTransition>
    </AdminGuard>
  ),
});

const adminOrderDetailsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin/order/$orderId',
  component: () => (
    <AdminGuard>
      <PageTransition>
        <AdminOrderDetails />
      </PageTransition>
    </AdminGuard>
  ),
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  checkoutRoute,
  orderConfirmationRoute,
  myOrdersRoute,
  orderDetailsRoute,
  adminRoute,
  adminDashboardRoute,
  createProductRoute,
  editProductRoute,
  adminOrdersRoute,
  adminOrderDetailsRoute,
]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <LanguageProvider>
        <RouterProvider router={router} />
        <Toaster />
      </LanguageProvider>
    </ThemeProvider>
  );
}
