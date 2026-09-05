import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { CATEGORY_LABELS, MUSCLE_LABELS } from '../data/exercises'
import { uid, useAllExercises, useExerciseMap, useStore } from '../store'
import type { Exercise, MuscleGroup, Workout, WorkoutExercise, WorkoutType } from '../types'

const GOALS = ['Força máxima', 'Hipertrofia', 'Potência', 'Força-resistência', 'Pegada / pescoço', 'Capacidade aeróbia', 'Capacidade anaeróbia', 'Mobilidade', 'Pré-competição', 'Outro']

function ExercisePicker({ onPick, onClose }: { onPick: (e: Exercise) => void; onClose: () => void }) {
  const all = useAllExercises()
  const [q, setQ] = useState('')
  const [muscle, setMuscle] = useState<MuscleGroup | 'todos'>('todos')
  const list = all.filter((e) => (muscle === 'todos' || e.muscles.includes(muscle)) && e.name.toLowerCase().includes(q.toLowerCase()))
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="row between">
          <h2>Adicionar exercício</h2>
          <button className="btn-sm" onClick={onClose}>Fechar</button>
        </div>
        <input autoFocus placeholder="Buscar..." value={q} onChange={(e) => setQ(e.target.value)} style={{ margin: '8px 0' }} />
        <div className="chips" style={{ marginBottom: 12 }}>
          <button className={`chip ${muscle === 'todos' ? 'active' : ''}`} onClick={() => setMuscle('todos')}>Todos</button>
          {Object.entries(MUSCLE_LABELS).map(([k, v]) => (
            <button key={k} className={`chip ${muscle === k ? 'active' : ''}`} onClick={() => setMuscle(k as MuscleGroup)}>{v}</button>
          ))}
        </div>
        {list.map((e) => (
          <div key={e.id} className="card clickable row between" onClick={() => onPick(e)}>
            <div>
              <strong>{e.name}</strong>
              <div className="muted" style={{ fontSize: '.8rem' }}>{e.muscles.map((m) => MUSCLE_LABELS[m]).join(', ')} · {e.equipment}</div>
            </div>
            <span className="badge accent">{CATEGORY_LABELS[e.category]}</span>
          </div>
        ))}
        {list.length === 0 && <div className="empty">Nenhum exercício encontrado.</div>}
      </div>
    </div>
  )
}

export default function WorkoutEditorPage() {
  const { id } = useParams()
  const existing = useStore((s) => s.workouts.find((w) => w.id === id))
  if (id && !existing) return <div className="empty">Treino não encontrado.</div>
  return <Editor key={id ?? 'novo'} existing={existing} />
}

function Editor({ existing }: { existing: Workout | undefined }) {
  const navigate = useNavigate()
  const addWorkout = useStore((s) => s.addWorkout)
  const updateWorkout = useStore((s) => s.updateWorkout)
  const exMap = useExerciseMap()

  const [name, setName] = useState(existing?.name ?? '')
  const [type, setType] = useState<WorkoutType>(existing?.type ?? 'musculacao')
  const [goal, setGoal] = useState(existing?.goal ?? 'Força máxima')
  const [exercises, setExercises] = useState<WorkoutExercise[]>(existing?.exercises ?? [])
  const [picker, setPicker] = useState(false)

  const isCond = type === 'condicionamento'

  const addExercise = (e: Exercise) => {
    const defaultSets = isCond ? [{ reps: '30 s', rest: 30 }, { reps: '30 s', rest: 30 }, { reps: '30 s', rest: 30 }] : [{ reps: '8', load: '', rest: 90 }, { reps: '8', load: '', rest: 90 }, { reps: '8', load: '', rest: 90 }]
    setExercises([...exercises, { id: uid(), exerciseId: e.id, sets: defaultSets }])
    setPicker(false)
  }

  const update = (i: number, patch: Partial<WorkoutExercise>) => setExercises(exercises.map((x, j) => (j === i ? { ...x, ...patch } : x)))
  const move = (i: number, dir: -1 | 1) => {
    const j = i + dir
    if (j < 0 || j >= exercises.length) return
    const arr = [...exercises]
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
    setExercises(arr)
  }

  const save = () => {
    if (!name.trim() || exercises.length === 0) return
    if (existing) {
      updateWorkout({ ...existing, name: name.trim(), type, goal, exercises })
    } else {
      addWorkout({ name: name.trim(), type, goal, exercises })
    }
    navigate('/treinos')
  }

  return (
    <div>
      <div className="row between">
        <h1>{existing ? 'Editar treino' : 'Novo treino'}</h1>
        <button className="btn-sm" onClick={() => navigate(-1)}>Voltar</button>
      </div>

      <div className="card stack">
        <label>Nome do treino<input value={name} onChange={(e) => setName(e.target.value)} placeholder="Ex.: Força A — Inferiores" /></label>
        <div className="grid-2">
          <label>Tipo
            <select value={type} onChange={(e) => setType(e.target.value as WorkoutType)}>
              <option value="musculacao">Musculação</option>
              <option value="condicionamento">Condicionamento</option>
            </select>
          </label>
          <label>Objetivo
            <select value={goal} onChange={(e) => setGoal(e.target.value)}>
              {GOALS.map((g) => <option key={g}>{g}</option>)}
            </select>
          </label>
        </div>
      </div>

      <h2>Exercícios ({exercises.length})</h2>
      {exercises.length === 0 && <div className="empty">Adicione exercícios para montar o treino.</div>}

      {exercises.map((we, i) => {
        const ex = exMap.get(we.exerciseId)
        return (
          <div key={we.id} className="card">
            <div className="row between">
              <div>
                <strong>{i + 1}. {ex?.name ?? we.exerciseId}</strong>
                {ex?.bjjNote && <div className="muted" style={{ fontSize: '.75rem' }}>🥋 {ex.bjjNote}</div>}
              </div>
              <div className="row">
                <button className="btn-icon btn-sm" onClick={() => move(i, -1)} disabled={i === 0}>↑</button>
                <button className="btn-icon btn-sm" onClick={() => move(i, 1)} disabled={i === exercises.length - 1}>↓</button>
                <button className="btn-icon btn-sm btn-danger" onClick={() => setExercises(exercises.filter((_, j) => j !== i))}>✕</button>
              </div>
            </div>

            <div className="set-row set-header" style={{ marginTop: 10 }}>
              <span>#</span><span>{isCond ? 'Tempo / reps' : 'Reps'}</span><span>{isCond ? 'Intensidade' : 'Carga (kg)'}</span><span>Descanso (s)</span><span />
            </div>
            {we.sets.map((st, k) => (
              <div key={k} className="set-row">
                <span className="num">{k + 1}</span>
                <input className="sm" value={st.reps} onChange={(e) => update(i, { sets: we.sets.map((s, m) => (m === k ? { ...s, reps: e.target.value } : s)) })} />
                <input className="sm" value={st.load ?? ''} placeholder={isCond ? 'máx' : '—'} onChange={(e) => update(i, { sets: we.sets.map((s, m) => (m === k ? { ...s, load: e.target.value } : s)) })} />
                <input className="sm" type="number" inputMode="numeric" value={st.rest ?? ''} onChange={(e) => update(i, { sets: we.sets.map((s, m) => (m === k ? { ...s, rest: e.target.value === '' ? undefined : Number(e.target.value) } : s)) })} />
                <button className="btn-icon btn-sm" onClick={() => update(i, { sets: we.sets.filter((_, m) => m !== k) })} disabled={we.sets.length <= 1}>−</button>
              </div>
            ))}
            <div className="row" style={{ marginTop: 6 }}>
              <button className="btn-sm" onClick={() => update(i, { sets: [...we.sets, { ...(we.sets[we.sets.length - 1] ?? { reps: '8', rest: 90 }) }] })}>+ Série</button>
              <input className="sm" placeholder="Observações (ex.: tempo 3-1-1, foco em velocidade)" value={we.notes ?? ''} onChange={(e) => update(i, { notes: e.target.value })} style={{ flex: 1, minWidth: 160 }} />
            </div>
          </div>
        )
      })}

      <button className="btn-block" onClick={() => setPicker(true)} style={{ marginBottom: 12 }}>+ Adicionar exercício</button>
      <button className="btn-primary btn-block" onClick={save} disabled={!name.trim() || exercises.length === 0}>Salvar treino</button>

      {picker && <ExercisePicker onPick={addExercise} onClose={() => setPicker(false)} />}
    </div>
  )
}
