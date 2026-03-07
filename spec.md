# Specification

## Summary
**Goal:** Add a dedicated Product Management page with full CRUD operations, inventory controls, and an Orders Dashboard for tracking customer orders in real-time.

**Planned changes:**
- Create a new Product Management page at `/admin/products` with a table displaying all products (name, price in ₹, description, image, category, stock quantity)
- Add inventory adjustment controls (+ and - buttons) to add or subtract stock quantities for each product
- Implement full CRUD operations: add new products, edit existing products, and delete products with confirmation
- Create an Orders Dashboard section showing all customer orders with order details, customer information, products ordered, total price, status, and timestamp
- Add navigation link in the admin dashboard header to access the Product Management page

**User-visible outcome:** Admins can manage products (add, edit, delete, adjust inventory) from a dedicated page and view all incoming customer orders in real-time from the admin panel.
