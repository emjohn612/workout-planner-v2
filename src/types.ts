export const WEIGHT_UNIT = "lbs";

export interface Exercise {
  id: string;
  name: string;
  muscleGroup: string;
  custom?: boolean;
}

export interface WorkoutExercise {
  exerciseId: string;
  name: string;
  muscleGroup: string;
  sets: number;
  reps: number;
}

export interface Workout {
  id: string;
  name: string;
  exercises: WorkoutExercise[];
  createdAt: number;
}

export interface LoggedSet {
  weight: number;
  reps: number;
}

export interface CompletedExercise {
  exerciseId: string;
  name: string;
  muscleGroup: string;
  sets: LoggedSet[];
}

export interface CompletedWorkout {
  id: string;
  workoutId: string;
  name: string;
  startedAt: number;
  finishedAt: number;
  durationSec: number;
  totalVolume: number;
  exercises: CompletedExercise[];
}

export interface ExerciseRecord {
  /** Best set ever logged (highest weight, ties broken by reps). */
  best: LoggedSet | null;
  /** Sets from the most recent session that included the exercise. */
  lastSets: LoggedSet[];
}
