import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { colors } from "../theme";

export function Orb({ label }: { label: string }) {
  return (
    <View style={styles.wrap}>
      <View style={styles.halo}>
        <View style={styles.outer}>
          <View style={styles.middle}>
            <View style={styles.inner}>
              <Text style={styles.mark}>a</Text>
            </View>
          </View>
        </View>
      </View>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.caption}>HERE WHEN YOU NEED ME</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: "center", justifyContent: "center", paddingVertical: 28 },
  halo: { width: 222, height: 222, borderRadius: 111, borderWidth: 1, borderColor: "#344638", backgroundColor: "#101712", alignItems: "center", justifyContent: "center" },
  outer: { width: 184, height: 184, borderRadius: 92, borderWidth: 1, borderColor: "#607B5E", backgroundColor: "#18231A", alignItems: "center", justifyContent: "center" },
  middle: { width: 146, height: 146, borderRadius: 73, borderWidth: 1, borderColor: "#8AA783", backgroundColor: "#243326", alignItems: "center", justifyContent: "center" },
  inner: { width: 104, height: 104, borderRadius: 52, backgroundColor: "#B8D8B0", alignItems: "center", justifyContent: "center", shadowColor: "#B8D8B0", shadowOpacity: 0.32, shadowRadius: 22, shadowOffset: { width: 0, height: 0 }, elevation: 10 },
  mark: { color: "#101710", fontSize: 58, fontWeight: "300", marginTop: -5 },
  label: { color: colors.primary, marginTop: 17, fontSize: 11, fontWeight: "700", letterSpacing: 2 },
  caption: { color: "#667366", marginTop: 6, fontSize: 8, letterSpacing: 2 }
});
