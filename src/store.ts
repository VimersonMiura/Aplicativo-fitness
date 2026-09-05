import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Exercise, Session, Workout } from './types'
import { EXERCISES } from './data/exercises'
import type { WorkoutTemplate } from './data/templates'

export const uid = () => Math.random().toString(36).slice(2, 10) + Date.now().toString(36)

interface State {
  workouts: Workout[]
  sessions: Session[]
  customExercises: Exercise[]
  addWorkout: (w: Omit<Workout, 'id' | 'createdAt'>) => string
  updateWorkout: (w: Workout) => void
  removeWorkout: (id: string) => void
  duplicateWorkout: (id: string) => string | undefined
  fromTemplate: (t: WorkoutTemplate) => string
  addSession: (s: Omit<Session, 'id'>) => void
  removeSession: (id: string) => void
  addCustomExercise: (e: Omit<Exercise, 'id' | 'custom'>) => void
  removeCustomExercise: (id: string) => void
}

export const useStore = create<State>()(
  persist(
    (set, get) => ({
      workouts: [],
      sessions: [],
      customExercises: [],
      addWorkout: (w) => {
        const id = uid()
        set((s) => ({ workouts: [{ ...w, id, createdAt: new Date().toISOString() }, ...s.workouts] }))
        return id
      },
      updateWorkout: (w) => set((s) => ({ workouts: s.workouts.map((x) => (x.id === w.id ? w : x)) })),
      removeWorkout: (id) => set((s) => ({ workouts: s.workouts.filter((x) => x.id !== id) })),
      duplicateWorkout: (id) => {
        const w = get().workouts.find((x) => x.id === id)
        if (!w) return undefined
        return get().addWorkout({
          name: `${w.name} (cópia)`,
          type: w.type,
          goal: w.goal,
          exercises: w.exercises.map((e) => ({ ...e, id: uid(), sets: e.sets.map((st) => ({ ...st })) })),
        })
      },
      fromTemplate: (t) =>
        get().addWorkout({
          name: t.name,
          type: t.type,
          goal: t.goal,
          exercises: t.exercises.map((e) => ({ id: uid(), exerciseId: e.exerciseId, notes: e.notes, sets: e.sets.map((st) => ({ ...st })) })),
        }),
      addSession: (s) => set((st) => ({ sessions: [{ ...s, id: uid() }, ...st.sessions] })),
      removeSession: (id) => set((s) => ({ sessions: s.sessions.filter((x) => x.id !== id) })),
      addCustomExercise: (e) => set((s) => ({ customExercises: [...s.customExercises, { ...e, id: uid(), custom: true }] })),
      removeCustomExercise: (id) => set((s) => ({ customExercises: s.customExercises.filter((x) => x.id !== id) })),
    }),
    { name: 'bjj-treinos' },
  ),
)

export function useAllExercises(): Exercise[] {
  const custom = useStore((s) => s.customExercises)
  return [...EXERCISES, ...custom]
}

export function useExerciseMap(): Map<string, Exercise> {
  const all = useAllExercises()
  return new Map(all.map((e) => [e.id, e]))
}
