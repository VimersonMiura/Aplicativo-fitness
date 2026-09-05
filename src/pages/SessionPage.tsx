import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useExerciseMap, useStore } from '../store'
import type { ExerciseLog, Session, Workout } from '../types'

const parseNum = (s: string | undefined) => {
  const n = parseFloat((s ?? '').replace(',', '.'))
  return Number.isFinite(n) ? n : 0
}

function RestTimer({ seconds, onDone }: { seconds: number; onDone: () => void }) {
  const [left, setLeft] = useState(seconds)
  useEffect(() => {
    if (left <= 0) { onDone(); return }
    const t = setTimeout(() => setLeft(left - 1), 1000)
    return () => clearTimeout(t)
  }, [left, onDone])
  return (
    <div className="card row between" style={{ borderColor: 'var(--accent)' }}>
      <span>Descanso</span>
      <span className="timer">{String(Math.floor(left / 60)).padStart(2, '0')}:{String(left % 60).padStart(2, '0')}</span>
      <button className="btn-sm" onClick={onDone}>Pular</button>
    </div>
  )
}

const initialLogs = (workout: Workout, lastSession: Session | undefined): ExerciseLog[] =>
  workout.exercises.map((we) => {
    const prev = lastSession?.exercises.find((e) => e.exerciseId === we.exerciseId)
    return {
      exerciseId: we.exerciseId,
      sets: we.sets.map((st, k) => ({
        reps: prev?.sets[k]?.reps ?? parseNum(st.reps),
        load: prev?.sets[k]?.load ?? parseNum(st.load),
        done: false,
      })),
    }
  })

export default function SessionPage() {
  const { id } = useParams()
  const workout = useStore((s) => s.workouts.find((w) => w.id === id))
  const lastSession = useStore((s) => s.sessions.find((x) => x.workoutId === id))
  if (!workout) return <div className="empty">Treino não encontrado.</div>
  return <Runner key={workout.id} workout={workout} lastSession={lastSession} />
}

function Runner({ workout, lastSession }: { workout: Workout; lastSession: Session | undefined }) {
  const navigate = useNavigate()
  const addSession = useStore((s) => s.addSession)
  const exMap = useExerciseMap()

  const [logs, setLogs] = useState<ExerciseLog[]>(() => initialLogs(workout, lastSession))
  const [rest, setRest] = useState<number | null>(null)
  const [rpe, setRpe] = useState(7)
  const [notes, setNotes] = useState('')
  const [startedAt] = useState(() => Date.now())

  const total = logs.reduce((a, e) => a + e.sets.length, 0)
  const done = logs.reduce((a, e) => a + e.sets.filter((s) => s.done).length, 0)

  const setLog = (i: number, k: number, patch: Partial<ExerciseLog['sets'][number]>) =>
    setLogs(logs.map((e, j) => (j === i ? { ...e, sets: e.sets.map((s, m) => (m === k ? { ...s, ...patch } : s)) } : e)))

  const toggle = (i: number, k: number) => {
    const wasDone = logs[i].sets[k].done
    setLog(i, k, { done: !wasDone })
    const r = workout.exercises[i].sets[k]?.rest
    if (!wasDone && r && r > 0) setRest(r)
  }

  const finish = () => {
    addSession({
      workoutId: workout.id,
      workoutName: workout.name,
      date: new Date().toISOString(),
      durationMin: Math.max(1, Math.round((Date.now() - startedAt) / 60000)),
      rpe,
      notes: notes.trim() || undefined,
      exercises: logs,
    })
    navigate('/historico')
  }

  return (
    <div>
      <div className="row between">
        <div>
          <h1>{workout.name}</h1>
          <small>{done}/{total} séries concluídas{lastSession ? ' · valores pré-preenchidos da última sessão' : ''}</small>
        </div>
        <button className="btn-sm" onClick={() => navigate('/treinos')}>Sair</button>
      </div>

      {rest !== null && <RestTimer key={rest + '-' + done} seconds={rest} onDone={() => setRest(null)} />}

      {workout.exercises.map((we, i) => {
        const ex = exMap.get(we.exerciseId)
        const log = logs[i]
        if (!log) return null
        return (
          <div key={we.id} className="card">
            <strong>{i + 1}. {ex?.name ?? we.exerciseId}</strong>
            <div className="muted" style={{ fontSize: '.8rem' }}>
              Plano: {we.sets.length} × {we.sets[0]?.reps}{we.sets[0]?.load ? ` @ ${we.sets[0].load}` : ''}{we.notes ? ` · ${we.notes}` : ''}
            </div>
            <div className="log-row set-header" style={{ marginTop: 8 }}>
              <span>#</span><span>Reps / tempo</span><span>Carga (kg)</span><span>OK</span>
            </div>
            {log.sets.map((s, k) => (
              <div key={k} className="log-row">
                <span className="num muted" style={{ textAlign: 'center' }}>{k + 1}</span>
                <input className="sm" type="number" inputMode="decimal" value={s.reps} onChange={(e) => setLog(i, k, { reps: Number(e.target.value) })} />
                <input className="sm" type="number" inputMode="decimal" step="0.5" value={s.load} onChange={(e) => setLog(i, k, { load: Number(e.target.value) })} />
                <button className={`check ${s.done ? 'done' : ''}`} onClick={() => toggle(i, k)} aria-label="Concluir série">{s.done ? '✓' : ''}</button>
              </div>
            ))}
          </div>
        )
      })}

      <div className="card stack">
        <h3>Finalizar sessão</h3>
        <label>Esforço percebido (RPE): {rpe}
          <input type="range" min={1} max={10} value={rpe} onChange={(e) => setRpe(Number(e.target.value))} />
        </label>
        <label>Observações<textarea rows={2} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Como foi o treino? Dores, energia, ajustes..." /></label>
        <button className="btn-primary btn-block" onClick={finish} disabled={done === 0}>Salvar sessão ({done}/{total})</button>
      </div>
    </div>
  )
}
