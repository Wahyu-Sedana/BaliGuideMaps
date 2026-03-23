import React from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { Location } from "../../domain/entities";

interface LocationMarkerProps {
  location: Location;
  onPress: () => void;
}

const CATEGORY_CONFIG: Record<string, { color: string; icon: string }> = {
  wisata:   { color: "#22c55e", icon: "beach-access" },
  health:   { color: "#ef4444", icon: "local-hospital" },
  hotel:    { color: "#3b82f6", icon: "hotel" },
  restoran: { color: "#f97316", icon: "restaurant" },
  pura:     { color: "#a855f7", icon: "place" },
};

const DEFAULT = { color: "#6b7280", icon: "place" };

export const LocationMarker: React.FC<LocationMarkerProps> = ({ location, onPress }) => {
  const categoryKey = location.category?.name?.toLowerCase() ?? "";
  const config = CATEGORY_CONFIG[categoryKey] ?? DEFAULT;

  return (
    <TouchableOpacity style={[styles.marker, { backgroundColor: config.color }]} onPress={onPress}>
      <MaterialIcons name={config.icon as any} size={22} color="#fff" />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  marker: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});
