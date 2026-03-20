# SmartWardrobe

## Current State
New project. No existing application files.

## Requested Changes (Diff)

### Add
- **Clothing Catalog**: Users can upload a clothing item photo (blob storage), then manually tag it with attributes: name, category (tops/bottoms/shoes/outerwear/accessories), color, style tags, and season suitability. Each item tracks how many times it has been worn (wear count) and last worn date.
- **Outfit of the Day**: A page that fetches current weather via HTTP outcall (OpenMeteo, no API key required) and displays the user's calendar events for today. Based on weather conditions and event type, it suggests outfit combinations from the user's catalog.
- **In-App Calendar**: Users can create upcoming events (name, date, event type: casual/work/formal/sport). These events drive outfit suggestions.
- **Sustainability Tracker**: Shows which wardrobe items have been worn fewer than a threshold number of times, sorted by underutilization. Displays wear count, days since last worn, and a "wear it today" action that logs a wear.
- **Authorization**: Login/logout with role-based access so each user sees only their own wardrobe.

### Modify
- N/A

### Remove
- N/A

## Implementation Plan
1. Select components: authorization, blob-storage, http-outcalls
2. Generate Motoko backend with:
   - ClothingItem type: id, ownerId, blobId, name, category, color, styleTags, seasons, wearCount, lastWorn
   - CalendarEvent type: id, ownerId, name, date (text), eventType
   - CRUD for clothing items and calendar events
   - logWear(itemId) increments wearCount and updates lastWorn
   - getWeather(lat, lon): HTTP outcall to api.open-meteo.com
   - getSustainabilityReport(): returns items sorted by wearCount ascending
   - getOutfitSuggestion(weatherCode, eventType): returns filtered items by season/category
3. Frontend pages: Wardrobe (catalog + upload), Outfit of the Day, Calendar Events, Sustainability Tracker
4. Navigation: top nav with 4 sections
