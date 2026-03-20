import Array "mo:core/Array";
import Iter "mo:core/Iter";
import Blob "mo:core/Blob";
import Text "mo:core/Text";
import Order "mo:core/Order";
import Float "mo:core/Float";
import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Runtime "mo:core/Runtime";
import Time "mo:core/Time";
import List "mo:core/List";
import Principal "mo:core/Principal";
import Storage "blob-storage/Storage";
import OutCall "http-outcalls/outcall";
import MixinAuthorization "authorization/MixinAuthorization";
import MixinStorage "blob-storage/Mixin";
import AccessControl "authorization/access-control";

actor {
  type Season = {
    #spring;
    #summer;
    #fall;
    #winter;
  };

  type Category = {
    #tops;
    #bottoms;
    #shoes;
    #outerwear;
    #accessories;
  };

  type EventType = {
    #casual;
    #work;
    #formal;
    #sport;
  };

  type WeatherCondition = {
    #clear;
    #cloudy;
    #rain;
    #snow;
    #windy;
  };

  type ClothingItem = {
    id : Nat;
    owner : Principal;
    name : Text;
    category : Category;
    color : Text;
    styleTags : [Text];
    seasons : [Season];
    wearCount : Nat;
    lastWorn : ?Int;
    photo : Storage.ExternalBlob;
  };

  module ClothingItem {
    public func compareByWearCount(a : ClothingItem, b : ClothingItem) : Order.Order {
      Nat.compare(a.wearCount, b.wearCount);
    };
    public func compare(a : ClothingItem, b : ClothingItem) : Order.Order {
      Nat.compare(a.id, b.id);
    };
  };

  type CalendarEvent = {
    id : Nat;
    owner : Principal;
    name : Text;
    date : Text;
    eventType : EventType;
  };

  module CalendarEvent {
    public func compare(a : CalendarEvent, b : CalendarEvent) : Order.Order {
      Nat.compare(a.id, b.id);
    };
  };

  public type UserProfile = {
    name : Text;
  };

  var nextClothingItemId = 0;
  var nextCalendarEventId = 0;

  let clothingItems = Map.empty<Nat, ClothingItem>();
  let calendarEvents = Map.empty<Nat, CalendarEvent>();
  let userProfiles = Map.empty<Principal, UserProfile>();

  include MixinStorage();
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

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

  public query ({ caller }) func getClothingItems() : async [ClothingItem] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view clothing items");
    };

    let callerItems = List.empty<ClothingItem>();
    for (item in clothingItems.values()) {
      if (item.owner == caller) {
        callerItems.add(item);
      };
    };
    callerItems.toArray().sort();
  };

  public query ({ caller }) func getCalendarEvents() : async [CalendarEvent] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view calendar events");
    };

    let callerEvents = List.empty<CalendarEvent>();
    for (event in calendarEvents.values()) {
      if (event.owner == caller) {
        callerEvents.add(event);
      };
    };
    callerEvents.toArray().sort();
  };

  public shared ({ caller }) func createClothingItem(name : Text, category : Category, color : Text, styleTags : [Text], seasons : [Season], photo : Storage.ExternalBlob) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create clothing items");
    };

    let id = nextClothingItemId;
    nextClothingItemId += 1;

    let item : ClothingItem = {
      id;
      owner = caller;
      name;
      category;
      color;
      styleTags;
      seasons;
      wearCount = 0;
      lastWorn = null;
      photo;
    };

    clothingItems.add(id, item);
    id;
  };

  public shared ({ caller }) func createCalendarEvent(name : Text, date : Text, eventType : EventType) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create calendar events");
    };

    let id = nextCalendarEventId;
    nextCalendarEventId += 1;

    let event : CalendarEvent = {
      id;
      owner = caller;
      name;
      date;
      eventType;
    };

    calendarEvents.add(id, event);
    id;
  };

  public shared ({ caller }) func logWear(itemId : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can log wear");
    };

    switch (clothingItems.get(itemId)) {
      case (null) {
        Runtime.trap("Clothing item not found");
      };
      case (?item) {
        if (item.owner != caller) {
          Runtime.trap("Unauthorized: You do not own this item");
        };

        let updatedItem = {
          id = item.id;
          owner = item.owner;
          name = item.name;
          category = item.category;
          color = item.color;
          styleTags = item.styleTags;
          seasons = item.seasons;
          wearCount = item.wearCount + 1;
          lastWorn = ?Time.now();
          photo = item.photo;
        };
        clothingItems.add(itemId, updatedItem);
      };
    };
  };

  public query ({ caller }) func transform(input : OutCall.TransformationInput) : async OutCall.TransformationOutput {
    OutCall.transform(input);
  };

  public shared ({ caller }) func getWeather(lat : Float, lon : Float) : async Text {
    let url = "https://api.open-meteo.com/v1/forecast?latitude=" # lat.toText() # "&longitude=" # lon.toText() # "&current=temperature_2m,weather_code&temperature_unit=celsius";
    await OutCall.httpGetRequest(url, [], transform);
  };

  public query ({ caller }) func getSustainabilityReport() : async [ClothingItem] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view sustainability reports");
    };

    let callerItems = List.empty<ClothingItem>();
    for (item in clothingItems.values()) {
      if (item.owner == caller) {
        callerItems.add(item);
      };
    };
    callerItems.toArray().sort(ClothingItem.compareByWearCount);
  };

  func filterItems(items : [ClothingItem], weatherCode : Nat, eventType : EventType) : [ClothingItem] {
    let suitableItems = List.empty<ClothingItem>();

    for (item in items.values()) {
      var weatherMatch = false;
      var eventMatch = false;

      if (weatherCode < 3) {
        for (season in item.seasons.values()) {
          if (season == #summer or season == #spring) {
            weatherMatch := true;
          };
        };
      } else if (weatherCode >= 61) {
        if (item.category == #outerwear) {
          weatherMatch := true;
        };
      } else {
        weatherMatch := true;
      };

      if (eventType == #formal) {
        for (tag in item.styleTags.values()) {
          if (tag == "formal") {
            eventMatch := true;
          };
        };
      } else {
        eventMatch := true;
      };

      if (weatherMatch and eventMatch) {
        suitableItems.add(item);
      };
    };

    suitableItems.toArray();
  };

  public query ({ caller }) func getOutfitSuggestion(weatherCode : Nat, eventType : EventType) : async [ClothingItem] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can get outfit suggestions");
    };

    let callerItems = List.empty<ClothingItem>();
    for (item in clothingItems.values()) {
      if (item.owner == caller) {
        callerItems.add(item);
      };
    };

    filterItems(callerItems.toArray(), weatherCode, eventType);
  };

  func getCurrentTimestamp() : Int {
    Time.now();
  };

  public shared ({ caller }) func testWearCycle(itemId : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can test wear cycle");
    };

    switch (clothingItems.get(itemId)) {
      case (null) {
        Runtime.trap("Clothing item not found");
      };
      case (?item) {
        if (item.owner != caller) {
          Runtime.trap("Unauthorized: You do not own this item");
        };

        let currentPassword = switch (item.lastWorn) {
          case (null) { getCurrentTimestamp() };
          case (?timestamp) { timestamp };
        };

        let updatedPassword = {
          id = item.id;
          owner = item.owner;
          name = item.name;
          category = item.category;
          color = item.color;
          styleTags = item.styleTags;
          seasons = item.seasons;
          wearCount = item.wearCount + 1;
          lastWorn = ?currentPassword;
          photo = item.photo;
        };
        clothingItems.add(itemId, updatedPassword);
      };
    };
  };
};
