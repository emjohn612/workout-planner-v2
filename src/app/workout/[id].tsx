import React, { useEffect, useRef, useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { FontAwesome } from "@expo/vector-icons";
import { COLORS } from "../../theme/theme";
import {
  CompletedExercise,
  ExerciseRecord,
  Workout,
  WEIGHT_UNIT,
} from "../../types";
import { useWorkouts } from "../../WorkoutContext";
import { confirmAction, formatDuration, formatNumber } from "../../confirm";

interface SetState {
  weight: string;
  reps: string;
  done: boolean;
}

const buildInitialSets = (
  workout: Workout,
  records: Record<string, ExerciseRecord>
): SetState[][] =>
  workout.exercises.map((ex) => {
    const last = records[ex.exerciseId]?.lastSets ?? [];
    return Array.from({ length: ex.sets }, (_, i) => {
      const prev = last[i] ?? last[last.length - 1];
      return {
        weight: prev ? formatNumber(prev.weight) : "",
        reps: prev ? `${prev.reps}` : `${ex.reps}`,
        done: false,
      };
    });
  });

const Session = ({ workout }: { workout: Workout }) => {
  const router = useRouter();
  const { records, completeWorkout } = useWorkouts();
  // snapshot of past performance when the workout starts
  const [startRecords] = useState(records);
  const [sets, setSets] = useState<SetState[][]>(() =>
    buildInitialSets(workout, records)
  );
  const startedAt = useRef(Date.now()).current;
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    const t = setInterval(
      () => setElapsed(Math.floor((Date.now() - startedAt) / 1000)),
      1000
    );
    return () => clearInterval(t);
  }, [startedAt]);

  const updateSet = (exIdx: number, setIdx: number, patch: Partial<SetState>) =>
    setSets((prev) =>
      prev.map((exSets, i) =>
        i !== exIdx
          ? exSets
          : exSets.map((s, j) => (j === setIdx ? { ...s, ...patch } : s))
      )
    );

  const addSet = (exIdx: number) =>
    setSets((prev) =>
      prev.map((exSets, i) => {
        if (i !== exIdx) return exSets;
        const last = exSets[exSets.length - 1];
        return [
          ...exSets,
          {
            weight: last?.weight ?? "",
            reps: last?.reps ?? `${workout.exercises[exIdx].reps}`,
            done: false,
          },
        ];
      })
    );

  const removeSet = (exIdx: number, setIdx: number) =>
    setSets((prev) =>
      prev.map((exSets, i) =>
        i !== exIdx ? exSets : exSets.filter((_, j) => j !== setIdx)
      )
    );

  const totalDone = sets.reduce((n, s) => n + s.filter((x) => x.done).length, 0);
  const totalSets = sets.reduce((n, s) => n + s.length, 0);

  const save = () => {
    const finishedAt = Date.now();
    const exercises: CompletedExercise[] = workout.exercises
      .map((ex, i) => ({
        exerciseId: ex.exerciseId,
        name: ex.name,
        muscleGroup: ex.muscleGroup,
        sets: sets[i]
          .filter((s) => s.done)
          .map((s) => ({
            weight: parseFloat(s.weight) || 0,
            reps: parseInt(s.reps, 10) || 0,
          })),
      }))
      .filter((ex) => ex.sets.length > 0);
    const totalVolume = exercises.reduce(
      (sum, ex) => sum + ex.sets.reduce((v, s) => v + s.weight * s.reps, 0),
      0
    );
    completeWorkout({
      workoutId: workout.id,
      name: workout.name,
      startedAt,
      finishedAt,
      durationSec: Math.max(1, Math.round((finishedAt - startedAt) / 1000)),
      totalVolume,
      exercises,
    });
    router.back();
  };

  const finish = () => {
    if (totalDone === 0) {
      confirmAction(
        "No sets logged",
        "You haven't completed any sets. Discard this workout?",
        "Discard",
        () => router.back()
      );
      return;
    }
    if (totalDone < totalSets) {
      confirmAction(
        "Finish workout?",
        `${totalSets - totalDone} set(s) are not completed and won't be saved.`,
        "Finish",
        save
      );
      return;
    }
    save();
  };

  const cancel = () =>
    confirmAction(
      "Discard workout?",
      "Your logged sets for this session will be lost.",
      "Discard",
      () => router.back()
    );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={cancel} hitSlop={10} style={styles.circleBtn}>
          <FontAwesome name="chevron-down" size={16} color={COLORS.primaryWhiteHex} />
        </Pressable>
        <View style={{ alignItems: "center" }}>
          <Text style={styles.headerTitle}>{workout.name}</Text>
          <Text style={styles.timer}>
            {formatDuration(elapsed)} • {totalDone}/{totalSets} sets
          </Text>
        </View>
        <Pressable onPress={finish} style={styles.finishBtn}>
          <Text style={styles.finishText}>Finish</Text>
        </Pressable>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        {workout.exercises.map((ex, exIdx) => {
          const best = startRecords[ex.exerciseId]?.best;
          const last = startRecords[ex.exerciseId]?.lastSets ?? [];
          return (
            <View key={`${ex.exerciseId}-${exIdx}`} style={styles.card}>
              <Text style={styles.exName}>{ex.name}</Text>
              <Text style={styles.previouslyDid}>
                {best
                  ? `Best: ${formatNumber(best.weight)} ${WEIGHT_UNIT} x ${best.reps} (max)`
                  : "Best: no history yet"}
              </Text>

              <View style={styles.tableRow}>
                <Text style={[styles.th, styles.colSet]}>Set</Text>
                <Text style={[styles.th, styles.colPrev]}>Previous</Text>
                <Text style={[styles.th, styles.colInput]}>{WEIGHT_UNIT}</Text>
                <Text style={[styles.th, styles.colInput]}>Reps</Text>
                <Text style={[styles.th, styles.colCheck]}>Done</Text>
              </View>

              {sets[exIdx].map((s, setIdx) => {
                const prev = last[setIdx];
                return (
                  <View
                    key={setIdx}
                    style={[styles.tableRow, s.done && styles.rowDone]}
                  >
                    <Pressable
                      style={styles.colSet}
                      onLongPress={() => removeSet(exIdx, setIdx)}
                    >
                      <Text style={styles.setNum}>{setIdx + 1}</Text>
                    </Pressable>
                    <Text style={[styles.prevText, styles.colPrev]}>
                      {prev ? `${formatNumber(prev.weight)} x ${prev.reps}` : "-"}
                    </Text>
                    <View style={styles.colInput}>
                      <TextInput
                        style={styles.input}
                        value={s.weight}
                        keyboardType="decimal-pad"
                        selectTextOnFocus
                        placeholder="0"
                        placeholderTextColor={COLORS.primaryLightGreyHex}
                        onChangeText={(t) =>
                          updateSet(exIdx, setIdx, {
                            weight: t.replace(",", ".").replace(/[^0-9.]/g, ""),
                          })
                        }
                      />
                    </View>
                    <View style={styles.colInput}>
                      <TextInput
                        style={styles.input}
                        value={s.reps}
                        keyboardType="number-pad"
                        selectTextOnFocus
                        placeholder="0"
                        placeholderTextColor={COLORS.primaryLightGreyHex}
                        onChangeText={(t) =>
                          updateSet(exIdx, setIdx, {
                            reps: t.replace(/[^0-9]/g, ""),
                          })
                        }
                      />
                    </View>
                    <View style={styles.colCheck}>
                      <Pressable
                        onPress={() => updateSet(exIdx, setIdx, { done: !s.done })}
                        style={[styles.checkBox, s.done && styles.checkBoxDone]}
                      >
                        <FontAwesome
                          name="check"
                          size={16}
                          color={s.done ? COLORS.primaryWhiteHex : COLORS.primaryLightGreyHex}
                        />
                      </Pressable>
                    </View>
                  </View>
                );
              })}

              <Pressable style={styles.addSetBtn} onPress={() => addSet(exIdx)}>
                <Text style={styles.addSetText}>+ Add set</Text>
              </Pressable>
            </View>
          );
        })}
        <Text style={styles.footerHint}>Long-press a set number to remove that set.</Text>
      </ScrollView>
    </SafeAreaView>
  );
};

export default function ActiveWorkout() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { workouts, loaded } = useWorkouts();
  const workout = workouts.find((w) => w.id === id);

  if (!loaded) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.message}>Loading...</Text>
      </SafeAreaView>
    );
  }
  if (!workout) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.message}>Workout not found.</Text>
        <Pressable style={styles.finishBtn} onPress={() => router.back()}>
          <Text style={styles.finishText}>Go back</Text>
        </Pressable>
      </SafeAreaView>
    );
  }
  return <Session workout={workout} />;
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.primaryGreyHex },
  message: {
    color: COLORS.primaryWhiteHex,
    textAlign: "center",
    marginVertical: 30,
    fontSize: 18,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 14,
  },
  circleBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: COLORS.secondaryDarkGreyHex,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: { color: COLORS.primaryWhiteHex, fontSize: 18 },
  timer: { color: COLORS.secondaryLightGreyHex, fontSize: 12, marginTop: 2 },
  finishBtn: {
    backgroundColor: COLORS.primaryRedHex,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignSelf: "center",
  },
  finishText: { color: COLORS.primaryWhiteHex, fontSize: 16 },
  content: { padding: 12, paddingBottom: 60 },
  card: {
    backgroundColor: COLORS.secondaryDarkGreyHex,
    borderRadius: 12,
    padding: 12,
    marginBottom: 14,
  },
  exName: { color: COLORS.primaryWhiteHex, fontSize: 18 },
  previouslyDid: {
    color: COLORS.primaryOrangeHex,
    fontSize: 13,
    marginTop: 4,
    marginBottom: 10,
  },
  tableRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 4,
    borderRadius: 8,
  },
  rowDone: { backgroundColor: "rgba(220,53,53,0.18)" },
  th: {
    color: COLORS.secondaryLightGreyHex,
    fontSize: 12,
    textAlign: "center",
  },
  colSet: { width: 36, alignItems: "center" },
  colPrev: { flex: 1.2, textAlign: "center" },
  colInput: { flex: 1, paddingHorizontal: 4 },
  colCheck: { width: 52, alignItems: "center" },
  setNum: { color: COLORS.primaryWhiteHex, fontSize: 15 },
  prevText: { color: COLORS.secondaryLightGreyHex, fontSize: 14 },
  input: {
    backgroundColor: COLORS.primaryGreyHex,
    color: COLORS.primaryWhiteHex,
    borderRadius: 8,
    paddingVertical: 8,
    textAlign: "center",
    fontSize: 16,
  },
  checkBox: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: COLORS.primaryGreyHex,
    alignItems: "center",
    justifyContent: "center",
  },
  checkBoxDone: { backgroundColor: COLORS.primaryRedHex },
  addSetBtn: {
    marginTop: 8,
    padding: 10,
    borderRadius: 8,
    backgroundColor: COLORS.primaryGreyHex,
    alignItems: "center",
  },
  addSetText: { color: COLORS.primaryWhiteHex },
  footerHint: {
    color: COLORS.primaryLightGreyHex,
    textAlign: "center",
    fontSize: 12,
  },
});
