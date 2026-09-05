import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useStore } from '../store'

const fmtDate = (iso: string) => new Date(iso).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })

export default function HomePage() {
  const workouts = useStore((s) => s.workouts)
  const sessions = useStore((s) => s.sessions)

  const [weekAgo] = useState(() => Date.now() - 7 * 86400000)
  const thisWeek = sessions.filter((s) => new Date(s.date).getTime() >= weekAgo)
  const totalVolume = thisWeek.reduce(
    (acc, s) => acc + s.exercises.reduce((a, e) => a + e.sets.filter((x) => x.done).reduce((b, x) => b + x.reps * x.load, 0), 0),
    0,
  )

  return (
    <div>
      <h1>Olá, atleta 🥋</h1>
      <p className="muted">Monte seus treinos de musculação e condicionamento e registre a evolução.</p>

      <div className="grid-3">
        <div className="card stat">
          <div className="value">{thisWeek.length}</div>
          <div className="label">treinos na semana</div>
        </div>
        <div className="card stat">
          <div className="value">{Math.round(totalVolume / 1000)}t</div>
          <div className="label">volume na semana</div>
        </div>
        <div className="card stat">
          <div className="value">{workouts.length}</div>
          <div className="label">treinos salvos</div>
        </div>
      </div>

      <div className="stack" style={{ marginTop: 12 }}>
        <Link className="btn btn-primary btn-block" to="/treinos/novo">+ Montar novo treino</Link>
        <Link className="btn btn-block" to="/modelos">Usar um modelo pronto para jiu jitsu</Link>
      </div>

      <h2 style={{ marginTop: 24 }}>Meus treinos</h2>
      {workouts.length === 0 && <div className="empty">Nenhum treino ainda. Comece por um modelo ou monte o seu.</div>}
      {workouts.slice(0, 5).map((w) => (
        <Link key={w.id} to={`/treinos/${w.id}/executar`} className="card clickable row between">
          <div>
            <strong>{w.name}</strong>
            <div className="muted" style={{ fontSize: '.8rem' }}>{w.exercises.length} exercícios{w.goal ? ` · ${w.goal}` : ''}</div>
          </div>
          <span className={`badge ${w.type === 'musculacao' ? 'accent' : 'blue'}`}>{w.type === 'musculacao' ? 'Musculação' : 'Condicionamento'}</span>
        </Link>
      ))}

      <h2 style={{ marginTop: 24 }}>Últimas sessões</h2>
      {sessions.length === 0 && <div className="empty">Nenhuma sessão registrada.</div>}
      {sessions.slice(0, 5).map((s) => (
        <div key={s.id} className="card row between">
          <div>
            <strong>{s.workoutName}</strong>
            <div className="muted" style={{ fontSize: '.8rem' }}>{fmtDate(s.date)}{s.durationMin ? ` · ${s.durationMin} min` : ''}{s.rpe ? ` · RPE ${s.rpe}` : ''}</div>
          </div>
        </div>
      ))}
    </div>
  )
}
