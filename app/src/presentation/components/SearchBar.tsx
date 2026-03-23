import React from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Location } from "../../domain/entities";

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  results?: Location[];
  onSelectResult?: (location: Location) => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChangeText,
  placeholder = "Cari lokasi...",
  results = [],
  onSelectResult,
}) => {
  const showDropdown = value.length > 2 && results.length > 0;

  return (
    <View style={styles.wrapper}>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor="#9ca3af"
          value={value}
          onChangeText={onChangeText}
          returnKeyType="search"
        />
        {value.length > 0 && (
          <TouchableOpacity
            onPress={() => onChangeText("")}
            style={styles.clearButton}
          >
            <Text style={styles.clearText}>✕</Text>
          </TouchableOpacity>
        )}
      </View>

      {showDropdown && (
        <View style={styles.dropdown}>
          <FlatList
            data={results.slice(0, 6)}
            keyExtractor={(item) => item.id}
            keyboardShouldPersistTaps="handled"
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.dropdownItem}
                onPress={() => {
                  onSelectResult?.(item);
                  onChangeText("");
                }}
              >
                <View style={styles.dropdownTextContainer}>
                  <Text style={styles.dropdownName} numberOfLines={1}>
                    {item.name}
                  </Text>
                  <Text style={styles.dropdownAddress} numberOfLines={1}>
                    {item.address}
                  </Text>
                </View>
              </TouchableOpacity>
            )}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
          />
        </View>
      )}

      {value.length > 2 && results.length === 0 && (
        <View style={styles.dropdown}>
          <Text style={styles.emptyText}>Lokasi tidak ditemukan</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    marginHorizontal: 10,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: "#1f2937",
  },
  clearButton: {
    padding: 4,
  },
  clearText: {
    fontSize: 13,
    color: "#9ca3af",
  },
  dropdown: {
    backgroundColor: "#fff",
    borderRadius: 12,
    marginTop: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
    overflow: "hidden",
  },
  dropdownItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  dropdownEmoji: {
    fontSize: 22,
    marginRight: 10,
  },
  dropdownTextContainer: {
    flex: 1,
  },
  dropdownName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1f2937",
  },
  dropdownAddress: {
    fontSize: 12,
    color: "#9ca3af",
    marginTop: 2,
  },
  separator: {
    height: 1,
    backgroundColor: "#f3f4f6",
    marginHorizontal: 14,
  },
  emptyText: {
    textAlign: "center",
    padding: 16,
    fontSize: 13,
    color: "#9ca3af",
  },
});
