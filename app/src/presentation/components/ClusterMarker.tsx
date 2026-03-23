import React from "react";
import { StyleSheet, View, Text } from "react-native";

interface ClusterMarkerProps {
  count: number;
}

/**
 * Rendered inside a react-native-maps <Marker> to represent a cluster.
 * Size and color scale with the number of locations in the cluster.
 */
export const ClusterMarker: React.FC<ClusterMarkerProps> = ({ count }) => {
  const size = count >= 20 ? 56 : count >= 10 ? 50 : count >= 5 ? 46 : 40;
  const bg = count >= 20 ? "#dc2626" : count >= 10 ? "#f97316" : count >= 5 ? "#f59e0b" : "#6366f1";

  return (
    <View style={[styles.outer, { width: size + 8, height: size + 8, borderRadius: (size + 8) / 2, borderColor: bg }]}>
      <View style={[styles.inner, { width: size, height: size, borderRadius: size / 2, backgroundColor: bg }]}>
        <Text style={styles.count}>{count}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  outer: {
    borderWidth: 3,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.85)",
  },
  inner: {
    justifyContent: "center",
    alignItems: "center",
  },
  count: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "800",
  },
});
