export type MuscleGroup =
  | 'peito'
  | 'costas'
  | 'ombros'
  | 'biceps'
  | 'triceps'
  | 'antebraco'
  | 'pernas'
  | 'gluteos'
  | 'core'
  | 'pescoco'
  | 'corpo-inteiro'

export type ExerciseCategory = 'forca' | 'potencia' | 'condicionamento' | 'mobilidade' | 'grip'

export interface Exercise {
  id: string
  name: string
  muscles: MuscleGroup[]
  category: ExerciseCategory
  equipment: string
  bjjNote?: string
  custom?: boolean
}

export interface SetPlan {
  reps: string
  load?: string
  rest?: number
}

export interface WorkoutExercise {
  id: string
  exerciseId: string
  sets: SetPlan[]
  notes?: string
}

export type WorkoutType = 'musculacao' | 'condicionamento'

export interface Workout {
  id: string
  name: string
  type: WorkoutType
  goal?: string
  exercises: WorkoutExercise[]
  createdAt: string
}

export interface SetLog {
  reps: number
  load: number
  done: boolean
}

export interface ExerciseLog {
  exerciseId: string
  sets: SetLog[]
}

export interface Session {
  id: string
  workoutId: string
  workoutName: string
  date: string
  durationMin?: number
  rpe?: number
  notes?: string
  exercises: ExerciseLog[]
}
