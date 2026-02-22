import Map "mo:core/Map";
import Runtime "mo:core/Runtime";
import Array "mo:core/Array";
import Text "mo:core/Text";
import Iter "mo:core/Iter";
import Principal "mo:core/Principal";
import Nat "mo:core/Nat";
import Order "mo:core/Order";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";
import MixinStorage "blob-storage/Mixin";
import Storage "blob-storage/Storage";

actor {
  type ProductCategory = {
    #electronics;
    #clothing;
    #home;
    #sports;
    #books;
  };

  module ProductCategory {
    public func toText(category : ProductCategory) : Text {
      switch (category) {
        case (#electronics) { "electronics" };
        case (#clothing) { "clothing" };
        case (#home) { "home" };
        case (#sports) { "sports" };
        case (#books) { "books" };
      };
    };
  };

  type Product = {
    id : Text;
    name : Text;
    description : Text;
    price : Nat;
    image : Storage.ExternalBlob;
    whatsappNumber : Text;
    category : ProductCategory;
    stock : Nat;
  };

  module Product {
    public func compare(p1 : Product, p2 : Product) : Order.Order {
      Text.compare(p1.id, p2.id);
    };

    public func compareByName(p1 : Product, p2 : Product) : Order.Order {
      Text.compare(p1.name, p2.name);
    };

    public func compareByPrice(p1 : Product, p2 : Product) : Order.Order {
      Nat.compare(p1.price, p2.price);
    };
  };

  public type CartItem = {
    product : Product;
    quantity : Nat;
  };

  public type OrderStatus = {
    #pending;
    #processing;
    #shipped;
    #delivered;
  };

  public type ShippingDetails = {
    name : Text;
    phone : Text;
    address : Text;
    city : Text;
  };

  public type Order = {
    id : Text;
    user : Principal;
    items : [CartItem];
    total : Nat;
    shippingDetails : ShippingDetails;
    status : OrderStatus;
    timestamp : Nat;
  };

  public type UserProfile = {
    name : Text;
    phone : Text;
    address : Text;
    city : Text;
  };

  include MixinStorage();

  let products = Map.empty<Text, Product>();
  let carts = Map.empty<Principal, [CartItem]>();
  let orders = Map.empty<Text, Order>();
  let userOrders = Map.empty<Principal, [Text]>();
  let accessControlState = AccessControl.initState();
  let userProfiles = Map.empty<Principal, UserProfile>();

  include MixinAuthorization(accessControlState);

  // User Profile Management
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Product Management - Admin Only
  public shared ({ caller }) func createProduct(
    name : Text,
    description : Text,
    price : Nat,
    image : Storage.ExternalBlob,
    whatsappNumber : Text,
    category : ProductCategory,
    stock : Nat,
  ) : async Text {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can create products");
    };

    let id = name # "." # ProductCategory.toText(category);
    let product : Product = {
      id;
      name;
      description;
      price;
      image;
      whatsappNumber;
      category;
      stock;
    };
    products.add(id, product);
    id;
  };

  public shared ({ caller }) func updateProduct(
    id : Text,
    name : Text,
    description : Text,
    price : Nat,
    image : Storage.ExternalBlob,
    whatsappNumber : Text,
    category : ProductCategory,
    stock : Nat,
  ) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update products");
    };

    switch (products.get(id)) {
      case (null) {
        Runtime.trap("Product with id '" # id # "' does not exist");
      };
      case (_) {
        let updatedProduct : Product = {
          id;
          name;
          description;
          price;
          image;
          whatsappNumber;
          category;
          stock;
        };
        products.add(id, updatedProduct);
      };
    };
  };

  public shared ({ caller }) func deleteProduct(id : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can delete products");
    };
    if (not products.containsKey(id)) {
      Runtime.trap("Product with id '" # id # "' does not exist");
    };
    products.remove(id);
  };

  // Public Product Queries
  public query func getProduct(id : Text) : async Product {
    switch (products.get(id)) {
      case (null) {
        Runtime.trap("Product with id '" # id # "' does not exist");
      };
      case (?product) { product };
    };
  };

  public query func getProducts() : async [Product] {
    products.values().toArray();
  };

  public query func getProductsByCategory(category : ProductCategory) : async [Product] {
    products.values().toArray().filter(
      func(product) {
        product.category == category;
      }
    );
  };

  // Cart Management - User Only
  public shared ({ caller }) func addToCart(productId : Text, quantity : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can add items to cart");
    };

    if (quantity <= 0) {
      Runtime.trap("Quantity must be greater than 0");
    };

    let product = switch (products.get(productId)) {
      case (null) {
        Runtime.trap("Product with id '" # productId # "' does not exist");
      };
      case (?p) { p };
    };

    if (product.stock < quantity) {
      Runtime.trap("Not enough stock available");
    };

    let currentCart = switch (carts.get(caller)) {
      case (null) { [] };
      case (?cart) { cart };
    };

    let updatedCart = switch (currentCart.find(func(item) { item.product.id == productId })) {
      case (null) {
        currentCart.concat([{ product; quantity }]);
      };
      case (?existingItem) {
        currentCart.map(
          func(item) {
            if (item.product.id == productId) {
              { item with quantity = item.quantity + quantity };
            } else {
              item;
            };
          }
        );
      };
    };

    carts.add(caller, updatedCart);
  };

  public query ({ caller }) func getCart() : async [CartItem] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view cart");
    };

    switch (carts.get(caller)) {
      case (null) { [] };
      case (?cart) { cart };
    };
  };

  public shared ({ caller }) func removeFromCart(productId : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can remove items from cart");
    };

    let currentCart = switch (carts.get(caller)) {
      case (null) {
        Runtime.trap("Cart is empty");
      };
      case (?cart) { cart };
    };

    if (not currentCart.find(func(item) { item.product.id == productId }).isSome()) {
      Runtime.trap("Product not found in cart");
    };

    let updatedCart = currentCart.filter(
      func(item) { item.product.id != productId }
    );

    carts.add(caller, updatedCart);
  };

  public shared ({ caller }) func updateCartQuantity(productId : Text, quantity : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can update cart quantities");
    };

    if (quantity <= 0) {
      Runtime.trap("Quantity must be greater than 0");
    };

    let currentCart = switch (carts.get(caller)) {
      case (null) {
        Runtime.trap("Cart is empty");
      };
      case (?cart) { cart };
    };

    if (not currentCart.find(func(item) { item.product.id == productId }).isSome()) {
      Runtime.trap("Product not found in cart");
    };

    let product = switch (products.get(productId)) {
      case (null) {
        Runtime.trap("Product with id '" # productId # "' does not exist");
      };
      case (?p) { p };
    };

    if (product.stock < quantity) {
      Runtime.trap("Not enough stock available");
    };

    let updatedCart = currentCart.map(
      func(item) {
        if (item.product.id == productId) {
          { item with quantity };
        } else {
          item;
        };
      }
    );

    carts.add(caller, updatedCart);
  };

  public shared ({ caller }) func clearCart() : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can clear cart");
    };

    carts.remove(caller);
  };

  // Checkout & Order Management - User Only
  public shared ({ caller }) func checkout(shippingDetails : ShippingDetails) : async Text {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can checkout");
    };

    let cart = switch (carts.get(caller)) {
      case (null) {
        Runtime.trap("Cart is empty");
      };
      case (?items) {
        if (items.size() == 0) {
          Runtime.trap("Cart is empty");
        };
        items;
      };
    };

    let total = cart.foldLeft(
      0,
      func(acc, item) {
        acc + (item.product.price * item.quantity);
      },
    );

    // Check stock and update inventory
    for (item in cart.values()) {
      let product = switch (products.get(item.product.id)) {
        case (null) {
          Runtime.trap("Product with id '" # item.product.id # "' does not exist");
        };
        case (?p) { p };
      };

      if (product.stock < item.quantity) {
        Runtime.trap("Not enough stock for product " # item.product.name);
      };

      let updatedProduct = { product with stock = product.stock - item.quantity };
      products.add(item.product.id, updatedProduct);
    };

    let orderId = caller.toText() # "." # 0.toText(); // Using 0 as a placeholder for timestamp
    let newOrder : Order = {
      id = orderId;
      user = caller;
      items = cart;
      total;
      shippingDetails;
      status = #pending;
      timestamp = 0; // Using 0 as a placeholder for timestamp
    };

    orders.add(orderId, newOrder);

    let existingOrders = switch (userOrders.get(caller)) {
      case (null) { [] };
      case (?orderIds) { orderIds };
    };
    userOrders.add(caller, existingOrders.concat([orderId]));

    carts.remove(caller);
    orderId;
  };

  public query ({ caller }) func getOrder(orderId : Text) : async Order {
    switch (orders.get(orderId)) {
      case (null) {
        Runtime.trap("Order with id '" # orderId # "' does not exist");
      };
      case (?order) {
        if (order.user != caller and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Can only view your own orders");
        };
        order;
      };
    };
  };

  public query ({ caller }) func getUserOrders() : async [Order] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view their orders");
    };

    let orderIds = switch (userOrders.get(caller)) {
      case (null) { [] };
      case (?ids) { ids };
    };
    orderIds.map(
      func(orderId) {
        switch (orders.get(orderId)) {
          case (null) { Runtime.trap("Order with id '" # orderId # "' does not exist") };
          case (?order) { order };
        };
      }
    );
  };

  public shared ({ caller }) func updateOrderStatus(orderId : Text, status : OrderStatus) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update order status");
    };

    let existingOrder = switch (orders.get(orderId)) {
      case (null) {
        Runtime.trap("Order with id '" # orderId # "' does not exist");
      };
      case (?order) { order };
    };

    let updatedOrder = { existingOrder with status };
    orders.add(orderId, updatedOrder);
  };

  public query ({ caller }) func getAllOrders() : async [Order] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view all orders");
    };
    orders.values().toArray();
  };

  public query ({ caller }) func getOrdersByStatus(status : OrderStatus) : async [Order] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can filter orders by status");
    };
    orders.values().toArray().filter(
      func(order) {
        order.status == status;
      }
    );
  };

  // Inventory Management
  public query ({ caller }) func getProductStock(productId : Text) : async Nat {
    switch (products.get(productId)) {
      case (null) {
        Runtime.trap("Product with id '" # productId # "' does not exist");
      };
      case (?product) { product.stock };
    };
  };

  public query ({ caller }) func getLowStockProducts(threshold : Nat) : async [Product] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view low stock products");
    };
    products.values().toArray().filter(
      func(product) {
        product.stock <= threshold;
      }
    );
  };

  // Aggregated Statistics
  public query ({ caller }) func getTotalProducts() : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view statistics");
    };
    products.size();
  };

  public query ({ caller }) func getTotalOrders() : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view statistics");
    };
    orders.size();
  };

  public query ({ caller }) func getPendingOrdersCount() : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view statistics");
    };
    orders.values().toArray().filter(func(order) { order.status == #pending }).size();
  };

  public query ({ caller }) func getLowStockCount(threshold : Nat) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view statistics");
    };
    products.values().toArray().filter(func(product) { product.stock <= threshold }).size();
  };

  public query ({ caller }) func getTotalRevenue() : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view statistics");
    };
    orders.values().toArray().foldLeft(0, func(acc, order) { acc + order.total });
  };
};
