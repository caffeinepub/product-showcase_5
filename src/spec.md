# Specification

## Summary
**Goal:** Create a comprehensive admin dashboard displaying key business metrics and recent orders.

**Planned changes:**
- Add admin dashboard page with metric cards showing total products, total orders, pending orders, low stock count, and total revenue
- Create backend query methods to retrieve aggregated statistics (getTotalProducts, getTotalOrders, getPendingOrdersCount, getLowStockCount, getTotalRevenue)
- Implement custom React hooks for fetching each dashboard statistic using React Query
- Add navigation link to dashboard in admin panel and main header for admin users
- Display recent orders section showing the 5 most recent orders with order details and link to view all orders

**User-visible outcome:** Admin users can access a new dashboard page displaying business metrics at a glance and view recent order activity, accessible from the admin navigation menu.
