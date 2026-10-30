import React, { useMemo, useState } from "react";
import {
  FlatList,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { FontAwesome } from "@expo/vector-icons";
import { COLORS } from "../../theme/theme";
import { MUSCLE_GROUPS } from "../../exerciseLibrary";
import { WEIGHT_UNIT } from "../../types";
import { useWorkouts } from "../../WorkoutContext";
import { formatNumber } from "../../confirm";
import AddExerciseModal from "../../components/AddExerciseModal";

const Exercises = () => {
  const { allExercises, records, addCustomExercise } = useWorkouts();
  const [modalIsVisible, setModalIsVisible] = useState(false);
  const [query, setQuery] = useState("");
  const [group, setGroup] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return allExercises.filter(
      (e) =>
        (!group || e.muscleGroup === group) &&
        (!q || e.name.toLowerCase().includes(q))
    );
  }, [allExercises, query, group]);

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>EXERCISES</Text>
        <Pressable onPress={() => setModalIsVisible(true)} style={styles.newBtn}>
          <FontAwesome name="plus" size={14} color={COLORS.primaryWhiteHex} />
          <Text style={styles.newBtnText}>  Custom</Text>
        </Pressable>
      </View>

      <TextInput
        style={styles.search}
        placeholder="Search exercises"
        placeholderTextColor={COLORS.secondaryLightGreyHex}
        value={query}
        onChangeText={setQuery}
      />
      <View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.chipRow}
        >
          {[null, ...MUSCLE_GROUPS].map((g) => (
            <Pressable
              key={g ?? "all"}
              onPress={() => setGroup(g)}
              style={[styles.chip, group === g && styles.chipActive]}
            >
              <Text style={styles.chipText}>{g ?? "All"}</Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => {
          const best = records[item.id]?.best;
          return (
            <View style={styles.exerciseItem}>
              <View style={{ flex: 1 }}>
                <Text style={styles.exerciseText}>{item.name}</Text>
                <Text style={styles.muscle}>
                  {item.muscleGroup}
                  {item.custom ? " • Custom" : ""}
                </Text>
              </View>
              <View style={styles.bestBox}>
                {best ? (
                  <>
                    <Text style={styles.bestValue}>
                      {formatNumber(best.weight)} {WEIGHT_UNIT}
                    </Text>
                    <Text style={styles.bestReps}>x {best.reps} reps</Text>
                  </>
                ) : (
                  <Text style={styles.noBest}>No record</Text>
                )}
              </View>
            </View>
          );
        }}
        ListEmptyComponent={<Text style={styles.empty}>No exercises found</Text>}
      />

      <AddExerciseModal
        visible={modalIsVisible}
        onCancel={() => setModalIsVisible(false)}
        onSubmit={(name, muscleGroup) => {
          addCustomExercise(name, muscleGroup);
          setModalIsVisible(false);
        }}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.primaryGreyHex },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  title: { color: COLORS.primaryRedHex, fontSize: 30 },
  newBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.primaryRedHex,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 8,
  },
  newBtnText: { color: COLORS.primaryWhiteHex, fontSize: 16 },
  search: {
    marginHorizontal: 16,
    borderWidth: 1,
    borderColor: COLORS.primaryLightGreyHex,
    borderRadius: 8,
    padding: 10,
    color: COLORS.primaryWhiteHex,
  },
  chipRow: { flexGrow: 0, paddingHorizontal: 16, marginVertical: 12 },
  chip: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 16,
    backgroundColor: COLORS.secondaryDarkGreyHex,
    marginRight: 8,
  },
  chipActive: { backgroundColor: COLORS.primaryRedHex },
  chipText: { color: COLORS.primaryWhiteHex },
  list: { paddingHorizontal: 16, paddingBottom: 110 },
  exerciseItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    marginVertical: 4,
    backgroundColor: COLORS.secondaryDarkGreyHex,
    borderRadius: 8,
  },
  exerciseText: { color: COLORS.primaryWhiteHex, fontSize: 16 },
  muscle: { color: COLORS.secondaryLightGreyHex, fontSize: 12, marginTop: 2 },
  bestBox: { alignItems: "flex-end", marginLeft: 8 },
  bestValue: { color: COLORS.primaryOrangeHex, fontSize: 16 },
  bestReps: { color: COLORS.secondaryLightGreyHex, fontSize: 12 },
  noBest: { color: COLORS.primaryLightGreyHex, fontSize: 12 },
  empty: { color: COLORS.secondaryLightGreyHex, textAlign: "center", marginTop: 30 },
});

export default Exercises;
