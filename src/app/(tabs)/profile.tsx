import React, { useEffect, useState } from "react";
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { FontAwesome } from "@expo/vector-icons";
import { COLORS } from "../../theme/theme";
import { WEIGHT_UNIT } from "../../types";
import { useWorkouts } from "../../WorkoutContext";
import { confirmAction, formatDuration, formatNumber } from "../../confirm";

const Profile = () => {
  const { bodyWeight, setBodyWeight, history, deleteHistoryEntry, loaded } =
    useWorkouts();
  const [weightText, setWeightText] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (loaded) setWeightText(bodyWeight != null ? formatNumber(bodyWeight) : "");
  }, [loaded, bodyWeight]);

  const saveWeight = () => {
    const value = parseFloat(weightText);
    if (!isNaN(value) && value > 0) {
      setBodyWeight(value);
      setSaved(true);
      setTimeout(() => setSaved(false), 1500);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <FlatList
        data={history}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ListHeaderComponent={
          <View>
            <Text style={styles.title}>PROFILE</Text>
            <View style={styles.weightCard}>
              <Text style={styles.cardLabel}>Current body weight</Text>
              <View style={styles.weightRow}>
                <TextInput
                  style={styles.weightInput}
                  value={weightText}
                  onChangeText={(t) =>
                    setWeightText(t.replace(",", ".").replace(/[^0-9.]/g, ""))
                  }
                  keyboardType="decimal-pad"
                  placeholder="0"
                  placeholderTextColor={COLORS.primaryLightGreyHex}
                />
                <Text style={styles.unit}>{WEIGHT_UNIT}</Text>
                <Pressable style={styles.saveBtn} onPress={saveWeight}>
                  <Text style={styles.saveText}>{saved ? "Saved" : "Save"}</Text>
                </Pressable>
              </View>
            </View>
            <Text style={styles.sectionTitle}>Completed Workouts</Text>
          </View>
        }
        renderItem={({ item }) => (
          <View style={styles.historyItem}>
            <View style={styles.historyHeader}>
              <View style={{ flex: 1 }}>
                <Text style={styles.historyName}>{item.name}</Text>
                <Text style={styles.historyDate}>
                  {new Date(item.finishedAt).toLocaleDateString(undefined, {
                    weekday: "short",
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </Text>
              </View>
              <Pressable
                hitSlop={10}
                onPress={() =>
                  confirmAction(
                    "Delete entry?",
                    "This removes the workout from your history and from your exercise records.",
                    "Delete",
                    () => deleteHistoryEntry(item.id)
                  )
                }
              >
                <FontAwesome name="trash" size={18} color={COLORS.primaryLightGreyHex} />
              </Pressable>
            </View>
            <Text style={styles.stats}>
              {formatDuration(item.durationSec)}  •  {formatNumber(Math.round(item.totalVolume))}{" "}
              {WEIGHT_UNIT} volume
            </Text>
            {item.exercises.map((ex) => (
              <Text key={ex.exerciseId} style={styles.exLine} numberOfLines={1}>
                {ex.sets.length} x {ex.name}
                {"  "}
                <Text style={styles.exBest}>
                  best{" "}
                  {formatNumber(Math.max(...ex.sets.map((s) => s.weight)))} {WEIGHT_UNIT}
                </Text>
              </Text>
            ))}
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.empty}>No completed workouts yet.</Text>
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.primaryGreyHex },
  list: { paddingHorizontal: 16, paddingBottom: 110 },
  title: { color: COLORS.primaryRedHex, fontSize: 30, marginVertical: 12 },
  weightCard: {
    backgroundColor: COLORS.secondaryDarkGreyHex,
    borderRadius: 10,
    padding: 14,
  },
  cardLabel: { color: COLORS.secondaryLightGreyHex, marginBottom: 8 },
  weightRow: { flexDirection: "row", alignItems: "center" },
  weightInput: {
    backgroundColor: COLORS.primaryGreyHex,
    color: COLORS.primaryWhiteHex,
    fontSize: 24,
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 14,
    minWidth: 110,
    textAlign: "center",
  },
  unit: { color: COLORS.primaryWhiteHex, fontSize: 18, marginLeft: 10, flex: 1 },
  saveBtn: {
    backgroundColor: COLORS.primaryRedHex,
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 8,
  },
  saveText: { color: COLORS.primaryWhiteHex, fontSize: 16 },
  sectionTitle: {
    color: COLORS.primaryWhiteHex,
    fontSize: 20,
    marginTop: 24,
    marginBottom: 8,
  },
  historyItem: {
    backgroundColor: COLORS.secondaryDarkGreyHex,
    borderRadius: 10,
    padding: 14,
    marginVertical: 5,
  },
  historyHeader: { flexDirection: "row", alignItems: "center" },
  historyName: { color: COLORS.primaryWhiteHex, fontSize: 18 },
  historyDate: { color: COLORS.secondaryLightGreyHex, fontSize: 12, marginTop: 2 },
  stats: { color: COLORS.secondaryLightGreyHex, fontSize: 13, marginVertical: 8 },
  exLine: { color: COLORS.primaryWhiteHex, fontSize: 13, paddingVertical: 2 },
  exBest: { color: COLORS.primaryOrangeHex },
  empty: { color: COLORS.secondaryLightGreyHex, textAlign: "center", marginTop: 20 },
});

export default Profile;
