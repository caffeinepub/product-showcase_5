import { RouterProvider, createRouter, createRoute, createRootRoute, Outlet } from '@tanstack/react-router';
import { useInternetIdentity } from './hooks/useInternetIdentity';
import { useIsAdmin } from './hooks/useIsAdmin';
import Header from './components/Header';
import Footer from './components/Footer';
import PublicCatalog from './pages/PublicCatalog';
import AdminPanel from './pages/AdminPanel';
import CreateProduct from './pages/CreateProduct';
import EditProduct from './pages/EditProduct';
import AdminGuard from './components/AdminGuard';

function Layout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

const rootRoute = createRootRoute({
  component: Layout,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: PublicCatalog,
});

const adminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin',
  component: () => (
    <AdminGuard>
      <AdminPanel />
    </AdminGuard>
  ),
});

const createProductRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin/create',
  component: () => (
    <AdminGuard>
      <CreateProduct />
    </AdminGuard>
  ),
});

const editProductRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin/edit/$id',
  component: () => (
    <AdminGuard>
      <EditProduct />
    </AdminGuard>
  ),
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  adminRoute,
  createProductRoute,
  editProductRoute,
]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}
