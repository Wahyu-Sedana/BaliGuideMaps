import "@testing-library/jest-native/extend-expect";

// Mock AsyncStorage
jest.mock("@react-native-async-storage/async-storage", () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
}));

// Mock expo-location
jest.mock("expo-location", () => ({
  requestForegroundPermissionsAsync: jest.fn(),
  getCurrentPositionAsync: jest.fn(),
  watchPositionAsync: jest.fn(),
}));

// Mock @rnmapbox/maps
jest.mock("@rnmapbox/maps", () => ({
  MapView: () => null,
  Camera: () => null,
  PointAnnotation: () => null,
  setAccessToken: jest.fn(),
}));

// Mock React Navigation
jest.mock("@react-navigation/native", () => ({
  useNavigationParam: () => ({}),
  useNavigation: () => ({
    navigate: jest.fn(),
    goBack: jest.fn(),
  }),
  useFocusEffect: jest.fn((cb) => cb()),
  NavigationContainer: ({ children }: { children: React.ReactNode }) =>
    children,
}));
