import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

interface Category {
  id: number;
  name: string;
}

interface CategoryFilterProps {
  categories: Category[];
  selectedCategory: number | null;
  onSelectCategory: (categoryId: number | null) => void;
}

type IconLib = "material" | "fa5";
interface CategoryConfig {
  icon: string;
  lib: IconLib;
  color: string;
  label: string;
}

const CATEGORY_CONFIG: Record<string, CategoryConfig> = {
  wisata:   { icon: "beach-access",   lib: "material", color: "#22c55e", label: "Wisata" },
  health:   { icon: "local-hospital", lib: "material", color: "#ef4444", label: "Kesehatan" },
  hotel:    { icon: "hotel",          lib: "material", color: "#3b82f6", label: "Hotel" },
  restoran: { icon: "restaurant",     lib: "material", color: "#f97316", label: "Restoran" },
  pura:     { icon: "place",          lib: "material", color: "#a855f7", label: "Pura" },
};

const DEFAULT_CONFIG: CategoryConfig = { icon: "place", lib: "material", color: "#6b7280", label: "Lainnya" };

const CategoryIcon: React.FC<{ config: CategoryConfig; size?: number }> = ({ config, size = 26 }) => {
  return <MaterialIcons name={config.icon as any} size={size} color="#fff" />;
};

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
  categories,
  selectedCategory,
  onSelectCategory,
}) => {
  return (
    <View style={styles.wrapper}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Semua / All */}
        <TouchableOpacity
          style={styles.item}
          onPress={() => onSelectCategory(null)}
          activeOpacity={0.8}
        >
          <View
            style={[
              styles.circle,
              { backgroundColor: "#6366f1" },
              selectedCategory === null && styles.circleActive,
            ]}
          >
            <MaterialIcons name="map" size={26} color="#fff" />
          </View>
          <Text style={[styles.label, selectedCategory === null && styles.labelActive]}>
            Semua
          </Text>
        </TouchableOpacity>

        {categories.map((category) => {
          const config = CATEGORY_CONFIG[category.name.toLowerCase()] ?? DEFAULT_CONFIG;
          const isActive = selectedCategory === category.id;

          return (
            <TouchableOpacity
              key={category.id}
              style={styles.item}
              onPress={() => onSelectCategory(category.id)}
              activeOpacity={0.8}
            >
              <View
                style={[
                  styles.circle,
                  { backgroundColor: config.color },
                  isActive && styles.circleActive,
                ]}
              >
                <CategoryIcon config={config} />
              </View>
              <Text style={[styles.label, isActive && styles.labelActive]}>
                {config.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    position: "absolute",
    bottom: 30,
    left: 0,
    right: 0,
    zIndex: 6,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 12,
  },
  item: {
    alignItems: "center",
    gap: 4,
  },
  circle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
    opacity: 0.75,
  },
  circleActive: {
    opacity: 1,
    borderWidth: 3,
    borderColor: "#fff",
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 8,
  },
  label: {
    fontSize: 11,
    fontWeight: "600",
    color: "#374151",
    textAlign: "center",
  },
  labelActive: {
    color: "#111827",
    fontWeight: "700",
  },
});
