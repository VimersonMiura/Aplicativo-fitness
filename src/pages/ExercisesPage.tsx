import { useState } from 'react'
import { CATEGORY_LABELS, MUSCLE_LABELS } from '../data/exercises'
import { useAllExercises, useStore } from '../store'
import type { ExerciseCategory, MuscleGroup } from '../types'

export default function ExercisesPage() {
  const all = useAllExercises()
  const addCustom = useStore((s) => s.addCustomExercise)
  const removeCustom = useStore((s) => s.removeCustomExercise)
  const [q, setQ] = useState('')
  const [muscle, setMuscle] = useState<MuscleGroup | 'todos'>('todos')
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ name: '', equipment: '', category: 'forca' as ExerciseCategory, muscle: 'corpo-inteiro' as MuscleGroup, bjjNote: '' })

  const list = all.filter(
    (e) => (muscle === 'todos' || e.muscles.includes(muscle)) && e.name.toLowerCase().includes(q.toLowerCase()),
  )

  const submit = () => {
    if (!form.name.trim()) return
    addCustom({ name: form.name.trim(), equipment: form.equipment.trim() || 'Livre', category: form.category, muscles: [form.muscle], bjjNote: form.bjjNote.trim() || undefined })
    setForm({ name: '', equipment: '', category: 'forca', muscle: 'corpo-inteiro', bjjNote: '' })
    setShowForm(false)
  }

  return (
    <div>
      <div className="row between">
        <h1>Exercícios</h1>
        <button className="btn-primary btn-sm" onClick={() => setShowForm((v) => !v)}>{showForm ? 'Cancelar' : '+ Criar'}</button>
      </div>

      {showForm && (
        <div className="card stack">
          <label>Nome<input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Ex.: Remada com kimono" /></label>
          <div className="grid-2">
            <label>Grupo muscular
              <select value={form.muscle} onChange={(e) => setForm({ ...form, muscle: e.target.value as MuscleGroup })}>
                {Object.entries(MUSCLE_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
              </select>
            </label>
            <label>Categoria
              <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value as ExerciseCategory })}>
                {Object.entries(CATEGORY_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
              </select>
            </label>
          </div>
          <label>Equipamento<input value={form.equipment} onChange={(e) => setForm({ ...form, equipment: e.target.value })} placeholder="Ex.: Kettlebell" /></label>
          <label>Relação com o jiu jitsu (opcional)<input value={form.bjjNote} onChange={(e) => setForm({ ...form, bjjNote: e.target.value })} /></label>
          <button className="btn-primary" onClick={submit} disabled={!form.name.trim()}>Salvar exercício</button>
        </div>
      )}

      <input placeholder="Buscar exercício..." value={q} onChange={(e) => setQ(e.target.value)} style={{ margin: '8px 0' }} />
      <div className="chips" style={{ marginBottom: 12 }}>
        <button className={`chip ${muscle === 'todos' ? 'active' : ''}`} onClick={() => setMuscle('todos')}>Todos</button>
        {Object.entries(MUSCLE_LABELS).map(([k, v]) => (
          <button key={k} className={`chip ${muscle === k ? 'active' : ''}`} onClick={() => setMuscle(k as MuscleGroup)}>{v}</button>
        ))}
      </div>

      <small>{list.length} exercícios</small>
      {list.map((e) => (
        <div key={e.id} className="card">
          <div className="row between">
            <strong>{e.name}</strong>
            <div className="row">
              <span className="badge accent">{CATEGORY_LABELS[e.category]}</span>
              {e.custom && <button className="btn-sm btn-danger" onClick={() => removeCustom(e.id)}>Excluir</button>}
            </div>
          </div>
          <div className="row" style={{ marginTop: 6 }}>
            {e.muscles.map((m) => <span key={m} className="badge">{MUSCLE_LABELS[m]}</span>)}
            <span className="badge">{e.equipment}</span>
          </div>
          {e.bjjNote && <p className="muted" style={{ fontSize: '.85rem', marginTop: 8 }}>🥋 {e.bjjNote}</p>}
        </div>
      ))}
    </div>
  )
}
