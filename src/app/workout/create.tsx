import React, { useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { FontAwesome } from "@expo/vector-icons";
import { COLORS } from "../../theme/theme";
import { Exercise, WorkoutExercise } from "../../types";
import { useWorkouts } from "../../WorkoutContext";
import ExercisePickerModal from "../../components/ExercisePickerModal";

const Stepper = ({
  label,
  value,
  min,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  onChange: (v: number) => void;
}) => (
  <View style={styles.stepper}>
    <Text style={styles.stepperLabel}>{label}</Text>
    <View style={styles.stepperControls}>
      <Pressable
        style={styles.stepBtn}
        onPress={() => onChange(Math.max(min, value - 1))}
        hitSlop={6}
      >
        <FontAwesome name="minus" size={12} color={COLORS.primaryWhiteHex} />
      </Pressable>
      <Text style={styles.stepValue}>{value}</Text>
      <Pressable
        style={styles.stepBtn}
        onPress={() => onChange(value + 1)}
        hitSlop={6}
      >
        <FontAwesome name="plus" size={12} color={COLORS.primaryWhiteHex} />
      </Pressable>
    </View>
  </View>
);

export default function CreateWorkout() {
  const router = useRouter();
  const { addWorkout } = useWorkouts();
  const [name, setName] = useState("");
  const [items, setItems] = useState<WorkoutExercise[]>([]);
  const [pickerVisible, setPickerVisible] = useState(false);

  const canSave = name.trim().length > 0 && items.length > 0;

  const pickExercise = (exercise: Exercise) => {
    setItems((prev) => [
      ...prev,
      {
        exerciseId: exercise.id,
        name: exercise.name,
        muscleGroup: exercise.muscleGroup,
        sets: 3,
        reps: 10,
      },
    ]);
    setPickerVisible(false);
  };

  const update = (index: number, patch: Partial<WorkoutExercise>) =>
    setItems((prev) => prev.map((it, i) => (i === index ? { ...it, ...patch } : it)));

  const remove = (index: number) =>
    setItems((prev) => prev.filter((_, i) => i !== index));

  const save = () => {
    if (!canSave) return;
    addWorkout({ name: name.trim(), exercises: items });
    router.back();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} hitSlop={10}>
          <FontAwesome name="close" size={22} color={COLORS.primaryRedHex} />
        </Pressable>
        <Text style={styles.title}>New Workout</Text>
        <Pressable onPress={save} disabled={!canSave} hitSlop={10}>
          <Text style={[styles.saveText, !canSave && styles.disabled]}>Save</Text>
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <TextInput
          style={styles.nameInput}
          placeholder="Workout name (e.g. Push Day)"
          placeholderTextColor={COLORS.secondaryLightGreyHex}
          value={name}
          onChangeText={setName}
        />

        {items.map((item, index) => (
          <View key={`${item.exerciseId}-${index}`} style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={{ flex: 1 }}>
                <Text style={styles.exName}>{item.name}</Text>
                <Text style={styles.exSub}>{item.muscleGroup}</Text>
              </View>
              <Pressable onPress={() => remove(index)} hitSlop={10}>
                <FontAwesome name="trash" size={20} color={COLORS.primaryRedHex} />
              </Pressable>
            </View>
            <View style={styles.steppers}>
              <Stepper
                label="Sets"
                value={item.sets}
                min={1}
                onChange={(v) => update(index, { sets: v })}
              />
              <Stepper
                label="Reps"
                value={item.reps}
                min={1}
                onChange={(v) => update(index, { reps: v })}
              />
            </View>
          </View>
        ))}

        <Pressable style={styles.addBtn} onPress={() => setPickerVisible(true)}>
          <FontAwesome name="plus" size={14} color={COLORS.primaryWhiteHex} />
          <Text style={styles.addBtnText}>  Add Exercise</Text>
        </Pressable>
        {items.length === 0 && (
          <Text style={styles.hint}>Add at least one exercise to save this workout.</Text>
        )}
      </ScrollView>

      <ExercisePickerModal
        visible={pickerVisible}
        onClose={() => setPickerVisible(false)}
        onPick={pickExercise}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.primaryGreyHex },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
  },
  title: { color: COLORS.primaryWhiteHex, fontSize: 20 },
  saveText: { color: COLORS.primaryRedHex, fontSize: 18 },
  disabled: { opacity: 0.4 },
  content: { padding: 16, paddingBottom: 40 },
  nameInput: {
    borderWidth: 1,
    borderColor: COLORS.primaryLightGreyHex,
    borderRadius: 8,
    padding: 12,
    color: COLORS.primaryWhiteHex,
    fontSize: 18,
    marginBottom: 16,
  },
  card: {
    backgroundColor: COLORS.secondaryDarkGreyHex,
    borderRadius: 10,
    padding: 14,
    marginBottom: 12,
  },
  cardHeader: { flexDirection: "row", alignItems: "center" },
  exName: { color: COLORS.primaryWhiteHex, fontSize: 17 },
  exSub: { color: COLORS.secondaryLightGreyHex, fontSize: 12, marginTop: 2 },
  steppers: { flexDirection: "row", marginTop: 14, justifyContent: "space-around" },
  stepper: { alignItems: "center" },
  stepperLabel: { color: COLORS.secondaryLightGreyHex, marginBottom: 6 },
  stepperControls: { flexDirection: "row", alignItems: "center" },
  stepBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.primaryLightGreyHex,
    alignItems: "center",
    justifyContent: "center",
  },
  stepValue: {
    color: COLORS.primaryWhiteHex,
    fontSize: 20,
    minWidth: 44,
    textAlign: "center",
  },
  addBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 14,
    borderRadius: 10,
    backgroundColor: COLORS.primaryRedHex,
    marginTop: 4,
  },
  addBtnText: { color: COLORS.primaryWhiteHex, fontSize: 16 },
  hint: { color: COLORS.secondaryLightGreyHex, textAlign: "center", marginTop: 12 },
});
