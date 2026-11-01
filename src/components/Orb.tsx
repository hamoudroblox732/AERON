import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { colors } from "../theme";

export function Orb({ label }: { label: string }) {
  return (
    <View style={styles.wrap}>
      <View style={styles.outer}>
        <View style={styles.middle}>
          <View style={styles.inner}><Text style={styles.mark}>A</Text></View>
        </View>
      </View>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: "center", justifyContent: "center", paddingVertical: 22 },
  outer: { width: 174, height: 174, borderRadius: 87, borderWidth: 1, borderColor: "#28536C", backgroundColor: "#0B1A29", alignItems: "center", justifyContent: "center" },
  middle: { width: 140, height: 140, borderRadius: 70, borderWidth: 2, borderColor: "#3987A8", backgroundColor: "#102A3B", alignItems: "center", justifyContent: "center" },
  inner: { width: 104, height: 104, borderRadius: 52, backgroundColor: colors.primarySoft, borderWidth: 2, borderColor: colors.primary, alignItems: "center", justifyContent: "center" },
  mark: { color: colors.primary, fontSize: 48, fontWeight: "300" },
  label: { color: colors.muted, marginTop: 14, fontSize: 13, letterSpacing: 1 }
});
