import Map "mo:core/Map";
import Text "mo:core/Text";
import Principal "mo:core/Principal";
import Storage "blob-storage/Storage";

module {
  // Old product type without product category and stock.
  type OldProduct = {
    id : Text;
    name : Text;
    description : Text;
    price : Nat;
    image : Storage.ExternalBlob;
    whatsappNumber : Text;
  };

  type OldActor = {
    products : Map.Map<Text, OldProduct>;
    userProfiles : Map.Map<Principal, { name : Text }>;
  };

  public func run(old : OldActor) : {
    products : Map.Map<Text, {
      id : Text;
      name : Text;
      description : Text;
      price : Nat;
      image : Storage.ExternalBlob;
      whatsappNumber : Text;
      category : {
        #electronics;
        #clothing;
        #home;
        #sports;
        #books;
      };
      stock : Nat;
    }>;
    userProfiles : Map.Map<Principal, {
      name : Text;
      phone : Text;
      address : Text;
      city : Text;
    }>;
  } {
    let newProducts = old.products.map<Text, OldProduct, {
      id : Text;
      name : Text;
      description : Text;
      price : Nat;
      image : Storage.ExternalBlob;
      whatsappNumber : Text;
      category : {
        #electronics;
        #clothing;
        #home;
        #sports;
        #books;
      };
      stock : Nat;
    }>(
      func(_id, oldProduct) {
        {
          oldProduct with
          category = #electronics;
          stock = 100;
        };
      }
    );

    let newUserProfiles = old.userProfiles.map<Principal, { name : Text }, {
      name : Text;
      phone : Text;
      address : Text;
      city : Text;
    }>(
      func(_principal, oldProfile) {
        {
          oldProfile with
          phone = "Not provided";
          address = "Not provided";
          city = "Not provided";
        };
      }
    );

    {
      products = newProducts;
      userProfiles = newUserProfiles;
    };
  };
};
