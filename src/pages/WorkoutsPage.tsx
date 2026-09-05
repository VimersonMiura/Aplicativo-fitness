import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useStore } from '../store'
import type { WorkoutType } from '../types'

export default function WorkoutsPage() {
  const workouts = useStore((s) => s.workouts)
  const removeWorkout = useStore((s) => s.removeWorkout)
  const duplicateWorkout = useStore((s) => s.duplicateWorkout)
  const navigate = useNavigate()
  const [filter, setFilter] = useState<WorkoutType | 'todos'>('todos')

  const list = workouts.filter((w) => filter === 'todos' || w.type === filter)

  return (
    <div>
      <div className="row between">
        <h1>Meus treinos</h1>
        <Link to="/treinos/novo" className="btn btn-primary btn-sm">+ Novo</Link>
      </div>
      <div className="chips" style={{ margin: '8px 0 16px' }}>
        {(['todos', 'musculacao', 'condicionamento'] as const).map((f) => (
          <button key={f} className={`chip ${filter === f ? 'active' : ''}`} onClick={() => setFilter(f)}>
            {f === 'todos' ? 'Todos' : f === 'musculacao' ? 'Musculação' : 'Condicionamento'}
          </button>
        ))}
      </div>

      {list.length === 0 && (
        <div className="empty">
          Nenhum treino aqui.
          <br />
          <Link to="/modelos" className="btn" style={{ marginTop: 12 }}>Ver modelos prontos</Link>
        </div>
      )}

      {list.map((w) => (
        <div key={w.id} className="card">
          <div className="row between">
            <div>
              <strong>{w.name}</strong>
              <div className="muted" style={{ fontSize: '.8rem' }}>
                {w.exercises.length} exercícios · {w.exercises.reduce((a, e) => a + e.sets.length, 0)} séries{w.goal ? ` · ${w.goal}` : ''}
              </div>
            </div>
            <span className={`badge ${w.type === 'musculacao' ? 'accent' : 'blue'}`}>{w.type === 'musculacao' ? 'Musculação' : 'Condicionamento'}</span>
          </div>
          <div className="row" style={{ marginTop: 10 }}>
            <Link to={`/treinos/${w.id}/executar`} className="btn btn-primary btn-sm">▶ Treinar</Link>
            <Link to={`/treinos/${w.id}`} className="btn btn-sm">Editar</Link>
            <button className="btn-sm" onClick={() => { const id = duplicateWorkout(w.id); if (id) navigate(`/treinos/${id}`) }}>Duplicar</button>
            <button className="btn-sm btn-danger" onClick={() => { if (confirm(`Excluir "${w.name}"?`)) removeWorkout(w.id) }}>Excluir</button>
          </div>
        </div>
      ))}
    </div>
  )
}
