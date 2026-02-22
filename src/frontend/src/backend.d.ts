import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export class ExternalBlob {
    getBytes(): Promise<Uint8Array<ArrayBuffer>>;
    getDirectURL(): string;
    static fromURL(url: string): ExternalBlob;
    static fromBytes(blob: Uint8Array<ArrayBuffer>): ExternalBlob;
    withUploadProgress(onProgress: (percentage: number) => void): ExternalBlob;
}
export interface Product {
    id: string;
    name: string;
    description: string;
    whatsappNumber: string;
    stock: bigint;
    category: ProductCategory;
    image: ExternalBlob;
    price: bigint;
}
export interface Order {
    id: string;
    status: OrderStatus;
    total: bigint;
    user: Principal;
    timestamp: bigint;
    items: Array<CartItem>;
    shippingDetails: ShippingDetails;
}
export interface ShippingDetails {
    city: string;
    name: string;
    address: string;
    phone: string;
}
export interface CartItem {
    quantity: bigint;
    product: Product;
}
export interface UserProfile {
    city: string;
    name: string;
    address: string;
    phone: string;
}
export enum OrderStatus {
    shipped = "shipped",
    pending = "pending",
    delivered = "delivered",
    processing = "processing"
}
export enum ProductCategory {
    clothing = "clothing",
    home = "home",
    books = "books",
    sports = "sports",
    electronics = "electronics"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addToCart(productId: string, quantity: bigint): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    checkout(shippingDetails: ShippingDetails): Promise<string>;
    clearCart(): Promise<void>;
    createProduct(name: string, description: string, price: bigint, image: ExternalBlob, whatsappNumber: string, category: ProductCategory, stock: bigint): Promise<string>;
    deleteProduct(id: string): Promise<void>;
    getAllOrders(): Promise<Array<Order>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getCart(): Promise<Array<CartItem>>;
    getLowStockProducts(threshold: bigint): Promise<Array<Product>>;
    getOrder(orderId: string): Promise<Order>;
    getOrdersByStatus(status: OrderStatus): Promise<Array<Order>>;
    getProduct(id: string): Promise<Product>;
    getProductStock(productId: string): Promise<bigint>;
    getProducts(): Promise<Array<Product>>;
    getProductsByCategory(category: ProductCategory): Promise<Array<Product>>;
    getUserOrders(): Promise<Array<Order>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    removeFromCart(productId: string): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    updateCartQuantity(productId: string, quantity: bigint): Promise<void>;
    updateOrderStatus(orderId: string, status: OrderStatus): Promise<void>;
    updateProduct(id: string, name: string, description: string, price: bigint, image: ExternalBlob, whatsappNumber: string, category: ProductCategory, stock: bigint): Promise<void>;
}
