import React, { useMemo, useState } from "react";
import {
  FlatList,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { FontAwesome } from "@expo/vector-icons";
import { COLORS } from "../theme/theme";
import { MUSCLE_GROUPS } from "../exerciseLibrary";
import { formatNumber } from "../confirm";
import { Exercise, WEIGHT_UNIT } from "../types";
import { useWorkouts } from "../WorkoutContext";
import AddExerciseModal from "./AddExerciseModal";

interface Props {
  visible: boolean;
  onClose: () => void;
  onPick: (exercise: Exercise) => void;
}

const ExercisePickerModal: React.FC<Props> = ({ visible, onClose, onPick }) => {
  const { allExercises, records, addCustomExercise } = useWorkouts();
  const [query, setQuery] = useState("");
  const [group, setGroup] = useState<string | null>(null);
  const [customVisible, setCustomVisible] = useState(false);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return allExercises.filter(
      (e) =>
        (!group || e.muscleGroup === group) &&
        (!q || e.name.toLowerCase().includes(q))
    );
  }, [allExercises, query, group]);

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Choose Exercise</Text>
          <Pressable onPress={onClose} hitSlop={10}>
            <FontAwesome name="close" size={22} color={COLORS.primaryRedHex} />
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
        <Pressable style={styles.customBtn} onPress={() => setCustomVisible(true)}>
          <FontAwesome name="plus" size={14} color={COLORS.primaryWhiteHex} />
          <Text style={styles.customBtnText}>  Create custom exercise</Text>
        </Pressable>
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id}
          keyboardShouldPersistTaps="handled"
          renderItem={({ item }) => {
            const best = records[item.id]?.best;
            return (
              <Pressable
                style={styles.row}
                onPress={() => {
                  onPick(item);
                  setQuery("");
                }}
              >
                <View style={{ flex: 1 }}>
                  <Text style={styles.rowName}>{item.name}</Text>
                  <Text style={styles.rowSub}>
                    {item.muscleGroup}
                    {item.custom ? " • Custom" : ""}
                    {best
                      ? ` • Best ${formatNumber(best.weight)} ${WEIGHT_UNIT} x ${best.reps}`
                      : ""}
                  </Text>
                </View>
                <FontAwesome name="plus-circle" size={22} color={COLORS.primaryRedHex} />
              </Pressable>
            );
          }}
          ListEmptyComponent={<Text style={styles.empty}>No exercises found</Text>}
        />
        <AddExerciseModal
          visible={customVisible}
          onCancel={() => setCustomVisible(false)}
          onSubmit={(name, muscleGroup) => {
            const created = addCustomExercise(name, muscleGroup);
            setCustomVisible(false);
            onPick(created);
          }}
        />
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.primaryGreyHex },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
  },
  title: { color: COLORS.primaryRedHex, fontSize: 24 },
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
  customBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 16,
    marginBottom: 8,
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.primaryLightGreyHex,
  },
  customBtnText: { color: COLORS.primaryWhiteHex },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 16,
    marginVertical: 4,
    padding: 12,
    borderRadius: 8,
    backgroundColor: COLORS.secondaryDarkGreyHex,
  },
  rowName: { color: COLORS.primaryWhiteHex, fontSize: 16 },
  rowSub: { color: COLORS.secondaryLightGreyHex, fontSize: 12, marginTop: 2 },
  empty: { color: COLORS.secondaryLightGreyHex, textAlign: "center", marginTop: 30 },
});

export default ExercisePickerModal;
