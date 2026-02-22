import React, { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'en' | 'ne';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  en: {
    appName: 'NPJ Shopping',
    ourProducts: 'Our Products',
    myOrders: 'My Orders',
    adminPanel: 'Admin Panel',
    dashboard: 'Dashboard',
    manageProducts: 'Manage Products',
    manageOrders: 'Manage Orders',
    addProduct: 'Add Product',
    deleteProduct: 'Delete Product',
    error: 'Error',
    noProductsFound: 'No products found',
    image: 'Image',
    productName: 'Product Name',
    category: 'Category',
    price: 'Price',
    stock: 'Stock',
    actions: 'Actions',
    lowStockAlert: 'Low Stock Alert',
    productsLowStock: 'products are low in stock',
    totalProducts: 'Total Products',
    totalOrders: 'Total Orders',
    pendingOrders: 'Pending Orders',
    lowStockItems: 'Low Stock Items',
    totalRevenue: 'Total Revenue',
    recentOrders: 'Recent Orders',
    viewAllOrders: 'View All Orders',
    noOrdersYet: 'No orders yet',
    customerName: 'Customer',
    allOrders: 'All Orders',
    pending: 'Pending',
    processing: 'Processing',
    shipped: 'Shipped',
    delivered: 'Delivered',
    noOrders: 'No orders found',
    items: 'Items',
  },
  ne: {
    appName: 'एनपीजे शपिङ',
    ourProducts: 'हाम्रा उत्पादनहरू',
    myOrders: 'मेरा अर्डरहरू',
    adminPanel: 'प्रशासक प्यानल',
    dashboard: 'ड्यासबोर्ड',
    manageProducts: 'उत्पादनहरू व्यवस्थापन गर्नुहोस्',
    manageOrders: 'अर्डरहरू व्यवस्थापन गर्नुहोस्',
    addProduct: 'उत्पादन थप्नुहोस्',
    deleteProduct: 'उत्पादन मेटाउनुहोस्',
    error: 'त्रुटि',
    noProductsFound: 'कुनै उत्पादन फेला परेन',
    image: 'तस्बिर',
    productName: 'उत्पादनको नाम',
    category: 'श्रेणी',
    price: 'मूल्य',
    stock: 'स्टक',
    actions: 'कार्यहरू',
    lowStockAlert: 'कम स्टक चेतावनी',
    productsLowStock: 'उत्पादनहरू कम स्टकमा छन्',
    totalProducts: 'कुल उत्पादनहरू',
    totalOrders: 'कुल अर्डरहरू',
    pendingOrders: 'पेन्डिङ अर्डरहरू',
    lowStockItems: 'कम स्टक वस्तुहरू',
    totalRevenue: 'कुल राजस्व',
    recentOrders: 'हालका अर्डरहरू',
    viewAllOrders: 'सबै अर्डरहरू हेर्नुहोस्',
    noOrdersYet: 'अहिलेसम्म कुनै अर्डर छैन',
    customerName: 'ग्राहक',
    allOrders: 'सबै अर्डरहरू',
    pending: 'पेन्डिङ',
    processing: 'प्रशोधन',
    shipped: 'पठाइएको',
    delivered: 'डेलिभर गरिएको',
    noOrders: 'कुनै अर्डर फेला परेन',
    items: 'वस्तुहरू',
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('en');

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === 'en' ? 'ne' : 'en'));
  };

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
