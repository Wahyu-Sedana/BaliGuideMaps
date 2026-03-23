# Bali Guide Map - React Native App

A production-ready React Native application for exploring Bali map using Mapbox, featuring tourism places, health facilities, and hotels. Built with React Native, TypeScript, MobX, and Clean Architecture.

## 📱 Features

✅ **Interactive Mapbox Map**

- Fullscreen map display
- Show markers with custom category icons
- Zoom and pan controls
- User location tracking

✅ **Location Management**

- View all locations
- Filter by category (wisata, health, hotel)
- Search locations by keyword
- Find nearby places within radius

✅ **Location Details**

- Comprehensive info view
- Display reviews and ratings
- Show distance from user
- Add new reviews

✅ **Architecture**

- Clean Architecture (Domain, Data, Presentation)
- MobX state management
- Dependency Injection
- TypeScript with strict mode

✅ **Testing**

- Jest unit tests
- React Native Testing Library
- Test coverage tracking

✅ **Code Quality**

- ESLint configuration
- TypeScript strict mode
- Proper error handling

## 🛠️ Tech Stack

- **React Native** - Mobile framework
- **Expo** - Development and deployment
- **TypeScript** - Type safety
- **MobX** - State management
- **@rnmapbox/maps** - Map integration
- **Axios** - HTTP client
- **Jest** - Testing framework
- **React Navigation** - Navigation library

## 📁 Project Structure

```
app/
├── src/
│   ├── core/
│   │   ├── api/                    # API client & configuration
│   │   ├── error/                  # Error handling
│   │   └── utils/                  # Helper functions
│   │
│   ├── data/
│   │   ├── models/                 # Data models
│   │   ├── repositories/           # Repository implementations
│   │   └── datasources/            # Remote API calls
│   │
│   ├── domain/
│   │   ├── entities/               # Domain entities
│   │   ├── repositories/           # Repository interfaces
│   │   └── usecases/               # Business logic
│   │
│   ├── presentation/
│   │   ├── screens/                # Screen components
│   │   ├── components/             # Reusable components
│   │   ├── stores/                 # MobX stores
│   │   ├── viewmodels/             # View models
│   │   └── navigation/             # Navigation setup
│   │
│   └── di/
│       └── ServiceLocator.ts       # Dependency injection
│
├── __tests__/
│   ├── setup.ts                    # Jest setup
│   ├── core/                       # Core layer tests
│   ├── domain/                     # Domain layer tests
│   ├── data/                       # Data layer tests
│   └── stores/                     # MobX store tests
│
├── App.tsx                         # Main app entry
├── package.json
├── tsconfig.json
├── jest.config.js
└── .eslintrc.json
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Expo CLI: `npm install -g expo-cli`
- Mapbox account (free tier available)

### Installation

1. **Clone or Navigate to Project**

```bash
cd app
```

2. **Install Dependencies**

```bash
npm install
```

3. **Configure Mapbox**

Get a free Mapbox token from [https://account.mapbox.com/](https://account.mapbox.com/)

Update the token in [src/presentation/screens/MapScreen.tsx](src/presentation/screens/MapScreen.tsx):

```typescript
MapboxGL.setAccessToken("your-mapbox-token-here");
```

4. **Start Development**

```bash
# For iOS
npm run ios

# For Android
npm run android

# For web
npm run web

# Or start Expo
npm start
```

## 📱 App Usage

### Map Screen

The main screen displays:

- **Fullscreen Mapbox map** with location markers
- **Custom markers** colored by category:
  - 🏛️ Green (wisata)
  - 🏥 Red (health)
  - 🏨 Blue (hotel)
- **Search bar** to find locations
- **Category filter** to show/hide by type
- **Location details panel** with info and reviews

### Interactions

1. **View Location**
   - Tap on marker to see details
   - Shows name, address, category, distance
   - View ratings and recent reviews

2. **Filter by Category**
   - Tap category buttons to filter
   - "All" shows all locations

3. **Search**
   - Type to search locations by name
   - Results update dynamically

4. **Nearby Locations**
   - App automatically shows nearby places on load
   - Uses your current location

## 🧪 Testing

### Run Tests

```bash
# Run all tests
npm test

# Watch mode
npm test:watch

# Coverage report
npm test:coverage
```

### Test Structure

```
__tests__/
├── core/
│   └── utils/
│       └── helpers.test.ts
├── domain/
│   └── usecases/
│       └── *.test.ts
├── data/
│   ├── repositories/
│   │   └── *.test.ts
│   └── datasources/
│       └── *.test.ts
└── stores/
    ├── LocationStore.test.ts
    └── ReviewStore.test.ts
```

## 🏗️ Clean Architecture Layers

### Domain Layer (Business Logic)

- Entities: Pure data models
- Repositories: Abstract interfaces
- Use Cases: Business rules implementation

### Data Layer (Implementation)

- Models: Concrete entity implementations
- Repositories: Execute use cases
- Data Sources: API communication

### Presentation Layer (UI)

- Screens: Full page components
- Components: Reusable UI pieces
- Stores: MobX state management
- Navigation: Screen routing

## 🔄 Data Flow

```
User Action → Screen → Store Action
   ↓
MobX Store (Observable)
   ↓
Use Case (Business Logic)
   ↓
Repository (Abstract)
   ↓
Data Source (API Call)
   ↓
Response → Store Update
   ↓
Component Re-render
```

## 🌐 API Integration

The app connects to the Bali Guide Map REST API:

**Base URL:** `http://localhost:8080/api/v1`

### Endpoints Used

- `GET /locations` - Get all locations
- `GET /locations/:id` - Get location details
- `GET /locations?category=:categoryId` - Filter by category
- `GET /locations/search?q=:keyword` - Search locations
- `GET /locations/nearby?lat=:lat&lon=:lon&radius=:radius` - Nearby locations
- `GET /categories` - Get all categories
- `GET /locations/:id/reviews` - Get reviews
- `POST /reviews` - Create review

## 🔐 Authentication (Future Implementation)

The API client supports JWT auth:

```typescript
// Token automatically included in requests
// Stored in AsyncStorage
const token = await AsyncStorage.getItem("jwt_token");
```

## 📊 MobX Store Architecture

### LocationStore

**Observables:**

- `locations[]` - All locations
- `filteredLocations[]` - Filtered results
- `selectedLocation` - Currently selected
- `categories[]` - Available categories
- `selectedCategory` - Active filter
- `loading` - Loading state
- `error` - Error state

**Actions:**

```typescript
store.fetchLocations();
store.fetchLocationsByCategory(categoryId);
store.searchLocations(keyword);
store.fetchNearbyLocations(lat, lon, radius);
store.selectCategory(categoryId);
store.selectLocation(location);
```

### ReviewStore

**Observables:**

- `reviews[]` - Location reviews
- `averageRating` - Average rating
- `loading` - Loading state
- `error` - Error state

**Actions:**

```typescript
store.fetchReviews(locationId);
store.fetchAverageRating(locationId);
store.createReview(userId, locationId, rating, comment);
```

## 🛡️ Error Handling

Custom error classes:

```typescript
-AppError(base) -
  NetworkError -
  NotFoundError -
  UnauthorizedError -
  ValidationError -
  ServerError;
```

All errors are caught and stored in store for UI display.

## 🎨 UI Components

### LocationMarker

Custom marker component for map pins with category-based colors and emojis.

### LocationDetail

Bottom sheet showing detailed location info, reviews, and rating.

### CategoryFilter

Horizontal scrollable category filter buttons.

### SearchBar

Search input for location discovery.

## 📈 Performance Optimizations

- MobX reactions prevent unnecessary re-renders
- Lazy loading of location data
- Cached responses
- Proper memory cleanup
- Component memoization

## 🚀 Deployment

### Build APK (Android)

```bash
eas build --platform android
```

### Build IPA (iOS)

```bash
eas build --platform ios
```

### Publish to Expo

```bash
eas publish
```

## 🧩 Extending the App

### Add New Feature

1. **Domain Layer**
   - Create entity interface
   - Define repository interface
   - Implement use case

2. **Data Layer**
   - Create data model
   - Implement repository
   - Add data source methods

3. **Presentation Layer**
   - Create MobX store
   - Build components
   - Add screens

4. **Dependency Injection**
   - Register in ServiceLocator

## 📝 Code Style

- ESLint configuration
- TypeScript strict mode
- Prop validation
- Null safety checks
- Error boundaries

## 🤝 Contributing

Follow these guidelines:

1. Create feature branch
2. Write tests first (TDD)
3. Implement feature
4. Ensure tests pass
5. Follow code style

## 📚 Resources

- [React Native Docs](https://reactnative.dev/)
- [Expo Docs](https://docs.expo.dev/)
- [MobX Docs](https://mobx.js.org/)
- [Mapbox GL Docs](https://docs.mapbox.com/ios/maps/guides/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

## 📄 License

MIT License

## 🆘 Troubleshooting

### Mapbox Not Loading

1. Verify access token is set
2. Check network connectivity
3. Ensure Mapbox account is active

### Location Permission Denied

1. Check app permissions in device settings
2. Android: Enable location permission
3. iOS: Allow "While Using" access

### API Connection Error

1. Ensure backend is running on `http://localhost:8080`
2. Check network connectivity
3. Verify API base URL in `apiClient.ts`

## 📞 Support

For issues or questions, check:

- GitHub Issues
- API Documentation
- Expo Community Forums

---

Built with ❤️ for exploring beautiful Bali
