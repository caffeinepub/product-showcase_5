import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'en' | 'ne';

interface LanguageContextType {
  language: Language;
  toggleLanguage: () => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('language');
    return (saved === 'ne' ? 'ne' : 'en') as Language;
  });

  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === 'en' ? 'ne' : 'en'));
  };

  const t = (key: string) => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
}

const translations: Record<Language, Record<string, string>> = {
  en: {
    // Header & Navigation
    appName: 'NPJ SHOPPING',
    login: 'Login',
    logout: 'Logout',
    loggingIn: 'Logging in...',
    adminPanel: 'Admin Panel',
    myOrders: 'My Orders',
    
    // Categories
    allCategories: 'All Categories',
    electronics: 'Electronics',
    clothing: 'Clothing',
    homeKitchen: 'Home & Kitchen',
    beautyPersonalCare: 'Beauty & Personal Care',
    sportsOutdoors: 'Sports & Outdoors',
    
    // Product Catalog
    discoverCollection: 'Discover Our Collection',
    exploreProducts: 'Explore our curated selection of premium products',
    ourProducts: 'Our Products',
    browseProducts: 'Browse through our carefully selected products',
    searchPlaceholder: 'Search products...',
    clearSearch: 'Clear',
    noProductsFound: 'No products found',
    loadingProducts: 'Loading products...',
    outOfStock: 'Out of Stock',
    lowStock: 'Low Stock',
    inStock: 'In Stock',
    addToCart: 'Add to Cart',
    contactWhatsApp: 'Contact on WhatsApp',
    
    // Cart
    cart: 'Cart',
    emptyCart: 'Your cart is empty',
    startShopping: 'Start Shopping',
    cartTotal: 'Total',
    proceedToCheckout: 'Proceed to Checkout',
    remove: 'Remove',
    quantity: 'Quantity',
    itemAddedToCart: 'Item added to cart',
    
    // Checkout
    checkout: 'Checkout',
    shippingDetails: 'Shipping Details',
    orderSummary: 'Order Summary',
    fullName: 'Full Name',
    phoneNumber: 'Phone Number',
    deliveryAddress: 'Delivery Address',
    city: 'City',
    placeOrder: 'Place Order',
    placingOrder: 'Placing Order...',
    paymentMethod: 'Payment Method',
    cashOnDelivery: 'Cash on Delivery (COD)',
    codDescription: 'Pay when you receive your order',
    
    // Order Confirmation
    orderPlaced: 'Order Placed Successfully!',
    orderConfirmation: 'Order Confirmation',
    orderId: 'Order ID',
    estimatedDelivery: 'Estimated Delivery',
    businessDays: '5-7 business days',
    deliveryNote: 'Your order will be delivered nationwide including Nepalganj',
    viewOrderDetails: 'View Order Details',
    continueShopping: 'Continue Shopping',
    
    // Orders
    myOrdersTitle: 'My Orders',
    noOrders: 'You have no orders yet',
    orderDate: 'Order Date',
    status: 'Status',
    total: 'Total',
    items: 'Items',
    viewDetails: 'View Details',
    
    // Order Status
    pending: 'Pending',
    processing: 'Processing',
    shipped: 'Shipped',
    delivered: 'Delivered',
    
    // Order Details
    orderDetails: 'Order Details',
    orderInformation: 'Order Information',
    shippingInformation: 'Shipping Information',
    orderedItems: 'Ordered Items',
    backToOrders: 'Back to Orders',
    
    // Admin
    manageProducts: 'Manage Products',
    manageOrders: 'Manage Orders',
    addProduct: 'Add Product',
    editProduct: 'Edit Product',
    deleteProduct: 'Delete',
    productName: 'Product Name',
    description: 'Description',
    price: 'Price',
    stock: 'Stock',
    category: 'Category',
    image: 'Image',
    whatsappNumber: 'WhatsApp Number',
    actions: 'Actions',
    edit: 'Edit',
    save: 'Save',
    cancel: 'Cancel',
    create: 'Create',
    update: 'Update',
    creating: 'Creating...',
    updating: 'Updating...',
    
    // Admin Orders
    allOrders: 'All Orders',
    pendingOrders: 'Pending Orders',
    filterByStatus: 'Filter by Status',
    customerName: 'Customer Name',
    updateStatus: 'Update Status',
    lowStockAlert: 'Low Stock Alert',
    productsLowStock: 'products are low in stock',
    
    // Profile Setup
    welcomeMessage: 'Welcome! Please complete your profile',
    setupProfile: 'Setup Profile',
    profileSetup: 'Profile Setup',
    
    // Common
    loading: 'Loading...',
    error: 'Error',
    success: 'Success',
    confirm: 'Confirm',
    close: 'Close',
    back: 'Back',
    next: 'Next',
    submit: 'Submit',
    required: 'Required',
    optional: 'Optional',
    
    // Footer
    builtWith: 'Built with',
    love: 'love',
    using: 'using',
    allRightsReserved: 'All rights reserved',
    
    // Currency
    currency: '₹',
  },
  ne: {
    // Header & Navigation
    appName: 'NPJ SHOPPING',
    login: 'लगइन',
    logout: 'लगआउट',
    loggingIn: 'लगइन गर्दै...',
    adminPanel: 'एडमिन प्यानल',
    myOrders: 'मेरो अर्डरहरू',
    
    // Categories
    allCategories: 'सबै श्रेणीहरू',
    electronics: 'इलेक्ट्रोनिक्स',
    clothing: 'कपडा',
    homeKitchen: 'घर र भान्सा',
    beautyPersonalCare: 'सौन्दर्य र व्यक्तिगत हेरचाह',
    sportsOutdoors: 'खेलकुद र बाहिरी',
    
    // Product Catalog
    discoverCollection: 'हाम्रो संग्रह पत्ता लगाउनुहोस्',
    exploreProducts: 'हाम्रो प्रिमियम उत्पादनहरूको चयन अन्वेषण गर्नुहोस्',
    ourProducts: 'हाम्रा उत्पादनहरू',
    browseProducts: 'हाम्रो सावधानीपूर्वक चयन गरिएका उत्पादनहरू ब्राउज गर्नुहोस्',
    searchPlaceholder: 'उत्पादनहरू खोज्नुहोस्...',
    clearSearch: 'खाली गर्नुहोस्',
    noProductsFound: 'कुनै उत्पादन फेला परेन',
    loadingProducts: 'उत्पादनहरू लोड गर्दै...',
    outOfStock: 'स्टकमा छैन',
    lowStock: 'कम स्टक',
    inStock: 'स्टकमा छ',
    addToCart: 'कार्टमा थप्नुहोस्',
    contactWhatsApp: 'WhatsApp मा सम्पर्क गर्नुहोस्',
    
    // Cart
    cart: 'कार्ट',
    emptyCart: 'तपाईंको कार्ट खाली छ',
    startShopping: 'किनमेल सुरु गर्नुहोस्',
    cartTotal: 'जम्मा',
    proceedToCheckout: 'चेकआउटमा जानुहोस्',
    remove: 'हटाउनुहोस्',
    quantity: 'परिमाण',
    itemAddedToCart: 'वस्तु कार्टमा थपियो',
    
    // Checkout
    checkout: 'चेकआउट',
    shippingDetails: 'ढुवानी विवरण',
    orderSummary: 'अर्डर सारांश',
    fullName: 'पूरा नाम',
    phoneNumber: 'फोन नम्बर',
    deliveryAddress: 'डेलिभरी ठेगाना',
    city: 'शहर',
    placeOrder: 'अर्डर गर्नुहोस्',
    placingOrder: 'अर्डर गर्दै...',
    paymentMethod: 'भुक्तानी विधि',
    cashOnDelivery: 'डेलिभरीमा नगद (COD)',
    codDescription: 'तपाईंले आफ्नो अर्डर प्राप्त गर्दा भुक्तानी गर्नुहोस्',
    
    // Order Confirmation
    orderPlaced: 'अर्डर सफलतापूर्वक राखियो!',
    orderConfirmation: 'अर्डर पुष्टिकरण',
    orderId: 'अर्डर आईडी',
    estimatedDelivery: 'अनुमानित डेलिभरी',
    businessDays: '५-७ व्यापार दिन',
    deliveryNote: 'तपाईंको अर्डर नेपालगञ्ज सहित राष्ट्रव्यापी डेलिभर गरिनेछ',
    viewOrderDetails: 'अर्डर विवरण हेर्नुहोस्',
    continueShopping: 'किनमेल जारी राख्नुहोस्',
    
    // Orders
    myOrdersTitle: 'मेरो अर्डरहरू',
    noOrders: 'तपाईंसँग अझै कुनै अर्डर छैन',
    orderDate: 'अर्डर मिति',
    status: 'स्थिति',
    total: 'जम्मा',
    items: 'वस्तुहरू',
    viewDetails: 'विवरण हेर्नुहोस्',
    
    // Order Status
    pending: 'पेन्डिङ',
    processing: 'प्रक्रियामा',
    shipped: 'पठाइएको',
    delivered: 'डेलिभर भयो',
    
    // Order Details
    orderDetails: 'अर्डर विवरण',
    orderInformation: 'अर्डर जानकारी',
    shippingInformation: 'ढुवानी जानकारी',
    orderedItems: 'अर्डर गरिएका वस्तुहरू',
    backToOrders: 'अर्डरहरूमा फर्कनुहोस्',
    
    // Admin
    manageProducts: 'उत्पादनहरू व्यवस्थापन गर्नुहोस्',
    manageOrders: 'अर्डरहरू व्यवस्थापन गर्नुहोस्',
    addProduct: 'उत्पादन थप्नुहोस्',
    editProduct: 'उत्पादन सम्पादन गर्नुहोस्',
    deleteProduct: 'मेटाउनुहोस्',
    productName: 'उत्पादन नाम',
    description: 'विवरण',
    price: 'मूल्य',
    stock: 'स्टक',
    category: 'श्रेणी',
    image: 'छवि',
    whatsappNumber: 'WhatsApp नम्बर',
    actions: 'कार्यहरू',
    edit: 'सम्पादन गर्नुहोस्',
    save: 'सुरक्षित गर्नुहोस्',
    cancel: 'रद्द गर्नुहोस्',
    create: 'सिर्जना गर्नुहोस्',
    update: 'अपडेट गर्नुहोस्',
    creating: 'सिर्जना गर्दै...',
    updating: 'अपडेट गर्दै...',
    
    // Admin Orders
    allOrders: 'सबै अर्डरहरू',
    pendingOrders: 'पेन्डिङ अर्डरहरू',
    filterByStatus: 'स्थिति अनुसार फिल्टर गर्नुहोस्',
    customerName: 'ग्राहक नाम',
    updateStatus: 'स्थिति अपडेट गर्नुहोस्',
    lowStockAlert: 'कम स्टक चेतावनी',
    productsLowStock: 'उत्पादनहरू कम स्टकमा छन्',
    
    // Profile Setup
    welcomeMessage: 'स्वागत छ! कृपया आफ्नो प्रोफाइल पूरा गर्नुहोस्',
    setupProfile: 'प्रोफाइल सेटअप',
    profileSetup: 'प्रोफाइल सेटअप',
    
    // Common
    loading: 'लोड गर्दै...',
    error: 'त्रुटि',
    success: 'सफलता',
    confirm: 'पुष्टि गर्नुहोस्',
    close: 'बन्द गर्नुहोस्',
    back: 'पछाडि',
    next: 'अर्को',
    submit: 'पेश गर्नुहोस्',
    required: 'आवश्यक',
    optional: 'वैकल्पिक',
    
    // Footer
    builtWith: 'निर्मित',
    love: 'माया',
    using: 'प्रयोग गरेर',
    allRightsReserved: 'सर्वाधिकार सुरक्षित',
    
    // Currency
    currency: 'रू',
  },
};
