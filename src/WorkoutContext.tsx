import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { EXERCISE_LIBRARY } from "./exerciseLibrary";
import { loadJSON, saveJSON, STORAGE_KEYS } from "./storage";
import {
  CompletedWorkout,
  Exercise,
  ExerciseRecord,
  LoggedSet,
  Workout,
} from "./types";

export const makeId = () =>
  `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;

/** True when `a` is a better set than `b` (heavier, or same weight with more reps). */
const isBetter = (a: LoggedSet, b: LoggedSet | null) =>
  !b || a.weight > b.weight || (a.weight === b.weight && a.reps > b.reps);

export function computeRecords(
  history: CompletedWorkout[]
): Record<string, ExerciseRecord> {
  const records: Record<string, ExerciseRecord> = {};
  // oldest -> newest so that lastSets ends up being the most recent session
  const ordered = [...history].sort((a, b) => a.finishedAt - b.finishedAt);
  for (const workout of ordered) {
    for (const ex of workout.exercises) {
      if (ex.sets.length === 0) continue;
      const rec = records[ex.exerciseId] ?? { best: null, lastSets: [] };
      for (const set of ex.sets) {
        if (isBetter(set, rec.best)) rec.best = { ...set };
      }
      rec.lastSets = ex.sets;
      records[ex.exerciseId] = rec;
    }
  }
  return records;
}

interface WorkoutContextValue {
  loaded: boolean;
  workouts: Workout[];
  customExercises: Exercise[];
  allExercises: Exercise[];
  history: CompletedWorkout[];
  bodyWeight: number | null;
  records: Record<string, ExerciseRecord>;
  addWorkout: (workout: Omit<Workout, "id" | "createdAt">) => void;
  deleteWorkout: (id: string) => void;
  addCustomExercise: (name: string, muscleGroup: string) => Exercise;
  completeWorkout: (workout: Omit<CompletedWorkout, "id">) => void;
  deleteHistoryEntry: (id: string) => void;
  setBodyWeight: (weight: number | null) => void;
}

const WorkoutContext = createContext<WorkoutContextValue | null>(null);

export const WorkoutProvider = ({ children }: { children: React.ReactNode }) => {
  const [loaded, setLoaded] = useState(false);
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [customExercises, setCustomExercises] = useState<Exercise[]>([]);
  const [history, setHistory] = useState<CompletedWorkout[]>([]);
  const [bodyWeight, setBodyWeightState] = useState<number | null>(null);

  useEffect(() => {
    (async () => {
      const [w, c, h, b] = await Promise.all([
        loadJSON<Workout[]>(STORAGE_KEYS.workouts, []),
        loadJSON<Exercise[]>(STORAGE_KEYS.customExercises, []),
        loadJSON<CompletedWorkout[]>(STORAGE_KEYS.history, []),
        loadJSON<number | null>(STORAGE_KEYS.bodyWeight, null),
      ]);
      setWorkouts(w);
      setCustomExercises(c);
      setHistory(h);
      setBodyWeightState(b);
      setLoaded(true);
    })();
  }, []);

  useEffect(() => {
    if (loaded) saveJSON(STORAGE_KEYS.workouts, workouts);
  }, [loaded, workouts]);
  useEffect(() => {
    if (loaded) saveJSON(STORAGE_KEYS.customExercises, customExercises);
  }, [loaded, customExercises]);
  useEffect(() => {
    if (loaded) saveJSON(STORAGE_KEYS.history, history);
  }, [loaded, history]);
  useEffect(() => {
    if (loaded) saveJSON(STORAGE_KEYS.bodyWeight, bodyWeight);
  }, [loaded, bodyWeight]);

  const addWorkout = useCallback(
    (workout: Omit<Workout, "id" | "createdAt">) => {
      setWorkouts((prev) => [
        { ...workout, id: makeId(), createdAt: Date.now() },
        ...prev,
      ]);
    },
    []
  );

  const deleteWorkout = useCallback((id: string) => {
    setWorkouts((prev) => prev.filter((w) => w.id !== id));
  }, []);

  const addCustomExercise = useCallback((name: string, muscleGroup: string) => {
    const exercise: Exercise = {
      id: `custom-${makeId()}`,
      name: name.trim(),
      muscleGroup,
      custom: true,
    };
    setCustomExercises((prev) => [...prev, exercise]);
    return exercise;
  }, []);

  const completeWorkout = useCallback((workout: Omit<CompletedWorkout, "id">) => {
    setHistory((prev) => [{ ...workout, id: makeId() }, ...prev]);
  }, []);

  const deleteHistoryEntry = useCallback((id: string) => {
    setHistory((prev) => prev.filter((h) => h.id !== id));
  }, []);

  const setBodyWeight = useCallback((weight: number | null) => {
    setBodyWeightState(weight);
  }, []);

  const allExercises = useMemo(
    () =>
      [...EXERCISE_LIBRARY, ...customExercises].sort((a, b) =>
        a.name.localeCompare(b.name)
      ),
    [customExercises]
  );

  const records = useMemo(() => computeRecords(history), [history]);

  const value = useMemo<WorkoutContextValue>(
    () => ({
      loaded,
      workouts,
      customExercises,
      allExercises,
      history,
      bodyWeight,
      records,
      addWorkout,
      deleteWorkout,
      addCustomExercise,
      completeWorkout,
      deleteHistoryEntry,
      setBodyWeight,
    }),
    [
      loaded,
      workouts,
      customExercises,
      allExercises,
      history,
      bodyWeight,
      records,
      addWorkout,
      deleteWorkout,
      addCustomExercise,
      completeWorkout,
      deleteHistoryEntry,
      setBodyWeight,
    ]
  );

  return (
    <WorkoutContext.Provider value={value}>{children}</WorkoutContext.Provider>
  );
};

export function useWorkouts(): WorkoutContextValue {
  const ctx = useContext(WorkoutContext);
  if (!ctx) throw new Error("useWorkouts must be used within a WorkoutProvider");
  return ctx;
}
