import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { TEMPLATES } from '../data/templates'
import { useExerciseMap, useStore } from '../store'
import type { WorkoutType } from '../types'

export default function TemplatesPage() {
  const fromTemplate = useStore((s) => s.fromTemplate)
  const exMap = useExerciseMap()
  const navigate = useNavigate()
  const [filter, setFilter] = useState<WorkoutType | 'todos'>('todos')
  const [open, setOpen] = useState<string | null>(null)

  const list = TEMPLATES.filter((t) => filter === 'todos' || t.type === filter)

  return (
    <div>
      <h1>Modelos para jiu jitsu</h1>
      <p className="muted">Treinos prontos pensados para a demanda do tatame. Adicione aos seus treinos e ajuste como quiser.</p>
      <div className="chips" style={{ margin: '8px 0 16px' }}>
        {(['todos', 'musculacao', 'condicionamento'] as const).map((f) => (
          <button key={f} className={`chip ${filter === f ? 'active' : ''}`} onClick={() => setFilter(f)}>
            {f === 'todos' ? 'Todos' : f === 'musculacao' ? 'Musculação' : 'Condicionamento'}
          </button>
        ))}
      </div>

      {list.map((t) => {
        const isOpen = open === t.id
        return (
          <div key={t.id} className="card">
            <div className="row between clickable" onClick={() => setOpen(isOpen ? null : t.id)} style={{ cursor: 'pointer' }}>
              <div>
                <strong>{t.name}</strong>
                <div className="muted" style={{ fontSize: '.8rem' }}>{t.goal} · ~{t.durationMin} min · {t.exercises.length} exercícios</div>
              </div>
              <span className={`badge ${t.type === 'musculacao' ? 'accent' : 'blue'}`}>{t.type === 'musculacao' ? 'Musculação' : 'Condicionamento'}</span>
            </div>
            <p className="muted" style={{ fontSize: '.85rem', marginTop: 8 }}>{t.description}</p>
            {isOpen && (
              <ul style={{ margin: '8px 0', paddingLeft: 18, fontSize: '.9rem' }}>
                {t.exercises.map((e, i) => (
                  <li key={i}>
                    {exMap.get(e.exerciseId)?.name ?? e.exerciseId} — {e.sets.length} × {e.sets[0]?.reps}
                    {e.notes && <span className="muted"> · {e.notes}</span>}
                  </li>
                ))}
              </ul>
            )}
            <div className="row" style={{ marginTop: 8 }}>
              <button className="btn-primary btn-sm" onClick={() => { const id = fromTemplate(t); navigate(`/treinos/${id}`) }}>Adicionar aos meus treinos</button>
              <button className="btn-sm" onClick={() => setOpen(isOpen ? null : t.id)}>{isOpen ? 'Ocultar' : 'Ver exercícios'}</button>
            </div>
          </div>
        )
      })}
    </div>
  )
}
