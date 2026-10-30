import { Exercise } from "./types";

export const MUSCLE_GROUPS = [
  "Chest",
  "Back",
  "Shoulders",
  "Biceps",
  "Triceps",
  "Legs",
  "Glutes",
  "Core",
] as const;

const make = (id: string, name: string, muscleGroup: string): Exercise => ({
  id: `lib-${id}`,
  name,
  muscleGroup,
});

export const EXERCISE_LIBRARY: Exercise[] = [
  // Chest
  make("bench-press", "Bench Press (Barbell)", "Chest"),
  make("incline-bench-press", "Incline Bench Press (Barbell)", "Chest"),
  make("db-bench-press", "Bench Press (Dumbbell)", "Chest"),
  make("incline-db-press", "Incline Press (Dumbbell)", "Chest"),
  make("chest-fly", "Chest Fly (Dumbbell)", "Chest"),
  make("cable-crossover", "Cable Crossover", "Chest"),
  make("push-up", "Push Up", "Chest"),
  make("dip", "Chest Dip", "Chest"),
  // Back
  make("deadlift", "Deadlift (Barbell)", "Back"),
  make("barbell-row", "Bent Over Row (Barbell)", "Back"),
  make("db-row", "One Arm Row (Dumbbell)", "Back"),
  make("pull-up", "Pull Up", "Back"),
  make("chin-up", "Chin Up", "Back"),
  make("lat-pulldown", "Lat Pulldown (Cable)", "Back"),
  make("seated-row", "Seated Row (Cable)", "Back"),
  make("t-bar-row", "T-Bar Row", "Back"),
  // Shoulders
  make("overhead-press", "Overhead Press (Barbell)", "Shoulders"),
  make("db-shoulder-press", "Shoulder Press (Dumbbell)", "Shoulders"),
  make("lateral-raise", "Lateral Raise (Dumbbell)", "Shoulders"),
  make("front-raise", "Front Raise (Dumbbell)", "Shoulders"),
  make("rear-delt-fly", "Rear Delt Fly (Dumbbell)", "Shoulders"),
  make("face-pull", "Face Pull (Cable)", "Shoulders"),
  make("shrug", "Shrug (Barbell)", "Shoulders"),
  // Biceps
  make("barbell-curl", "Bicep Curl (Barbell)", "Biceps"),
  make("db-curl", "Bicep Curl (Dumbbell)", "Biceps"),
  make("hammer-curl", "Hammer Curl (Dumbbell)", "Biceps"),
  make("preacher-curl", "Preacher Curl", "Biceps"),
  // Triceps
  make("close-grip-bench", "Close Grip Bench Press (Barbell)", "Triceps"),
  make("tricep-pushdown", "Triceps Pushdown (Cable)", "Triceps"),
  make("skullcrusher", "Skullcrusher (Barbell)", "Triceps"),
  make("overhead-tricep-ext", "Overhead Triceps Extension (Dumbbell)", "Triceps"),
  make("tricep-dip", "Triceps Dip", "Triceps"),
  // Legs
  make("squat", "Squat (Barbell)", "Legs"),
  make("front-squat", "Front Squat (Barbell)", "Legs"),
  make("leg-press", "Leg Press", "Legs"),
  make("lunge", "Lunge (Dumbbell)", "Legs"),
  make("bulgarian-split-squat", "Bulgarian Split Squat (Dumbbell)", "Legs"),
  make("leg-extension", "Leg Extension (Machine)", "Legs"),
  make("leg-curl", "Leg Curl (Machine)", "Legs"),
  make("rdl", "Romanian Deadlift (Barbell)", "Legs"),
  make("calf-raise", "Calf Raise (Barbell)", "Legs"),
  // Glutes
  make("hip-thrust", "Hip Thrust (Barbell)", "Glutes"),
  make("glute-bridge", "Glute Bridge", "Glutes"),
  make("cable-kickback", "Glute Kickback (Cable)", "Glutes"),
  // Core
  make("plank", "Plank", "Core"),
  make("crunch", "Crunch", "Core"),
  make("hanging-leg-raise", "Hanging Leg Raise", "Core"),
  make("cable-crunch", "Cable Crunch", "Core"),
  make("russian-twist", "Russian Twist", "Core"),
];
