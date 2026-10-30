import AsyncStorage from "@react-native-async-storage/async-storage";

export const STORAGE_KEYS = {
  workouts: "@workout-planner/workouts",
  customExercises: "@workout-planner/customExercises",
  history: "@workout-planner/history",
  bodyWeight: "@workout-planner/bodyWeight",
} as const;

export async function loadJSON<T>(key: string, fallback: T): Promise<T> {
  try {
    const raw = await AsyncStorage.getItem(key);
    return raw == null ? fallback : (JSON.parse(raw) as T);
  } catch (err) {
    console.warn(`Failed to load ${key}`, err);
    return fallback;
  }
}

export async function saveJSON<T>(key: string, value: T): Promise<void> {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.warn(`Failed to save ${key}`, err);
  }
}
