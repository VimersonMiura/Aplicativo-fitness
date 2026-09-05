import { useMemo, useState } from 'react'
import { useExerciseMap, useStore } from '../store'

const fmt = (iso: string) => new Date(iso).toLocaleDateString('pt-BR', { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' })

export default function HistoryPage() {
  const sessions = useStore((s) => s.sessions)
  const removeSession = useStore((s) => s.removeSession)
  const exMap = useExerciseMap()
  const [open, setOpen] = useState<string | null>(null)
  const [exerciseFilter, setExerciseFilter] = useState('')

  const prs = useMemo(() => {
    const map = new Map<string, { load: number; reps: number; date: string }>()
    for (const s of sessions) {
      for (const e of s.exercises) {
        for (const st of e.sets) {
          if (!st.done || st.load <= 0) continue
          const cur = map.get(e.exerciseId)
          if (!cur || st.load > cur.load || (st.load === cur.load && st.reps > cur.reps)) map.set(e.exerciseId, { load: st.load, reps: st.reps, date: s.date })
        }
      }
    }
    return [...map.entries()].sort((a, b) => b[1].load - a[1].load)
  }, [sessions])

  const exportJson = () => {
    const blob = new Blob([JSON.stringify({ sessions, exportedAt: new Date().toISOString() }, null, 2)], { type: 'application/json' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = `bjj-treinos-historico-${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(a.href)
  }

  const filtered = exerciseFilter ? prs.filter(([id]) => (exMap.get(id)?.name ?? id).toLowerCase().includes(exerciseFilter.toLowerCase())) : prs

  return (
    <div>
      <div className="row between">
        <h1>Histórico</h1>
        <button className="btn-sm" onClick={exportJson} disabled={sessions.length === 0}>Exportar</button>
      </div>

      <h2>Recordes (carga máxima)</h2>
      {prs.length === 0 && <div className="empty">Registre sessões com carga para ver seus recordes.</div>}
      {prs.length > 0 && (
        <>
          <input placeholder="Filtrar exercício..." value={exerciseFilter} onChange={(e) => setExerciseFilter(e.target.value)} style={{ marginBottom: 8 }} />
          <div className="card">
            {filtered.slice(0, 12).map(([id, pr]) => (
              <div key={id} className="row between" style={{ padding: '6px 0', borderBottom: '1px solid var(--border)' }}>
                <span>{exMap.get(id)?.name ?? id}</span>
                <span><strong style={{ color: 'var(--accent)' }}>{pr.load} kg</strong> × {pr.reps} <small>· {new Date(pr.date).toLocaleDateString('pt-BR')}</small></span>
              </div>
            ))}
          </div>
        </>
      )}

      <h2 style={{ marginTop: 20 }}>Sessões ({sessions.length})</h2>
      {sessions.length === 0 && <div className="empty">Nenhuma sessão registrada ainda.</div>}
      {sessions.map((s) => {
        const isOpen = open === s.id
        const vol = s.exercises.reduce((a, e) => a + e.sets.filter((x) => x.done).reduce((b, x) => b + x.reps * x.load, 0), 0)
        const setsDone = s.exercises.reduce((a, e) => a + e.sets.filter((x) => x.done).length, 0)
        return (
          <div key={s.id} className="card">
            <div className="row between" style={{ cursor: 'pointer' }} onClick={() => setOpen(isOpen ? null : s.id)}>
              <div>
                <strong>{s.workoutName}</strong>
                <div className="muted" style={{ fontSize: '.8rem' }}>
                  {fmt(s.date)}{s.durationMin ? ` · ${s.durationMin} min` : ''}{s.rpe ? ` · RPE ${s.rpe}` : ''} · {setsDone} séries{vol > 0 ? ` · ${Math.round(vol)} kg` : ''}
                </div>
              </div>
              <span className="muted">{isOpen ? '▲' : '▼'}</span>
            </div>
            {isOpen && (
              <div style={{ marginTop: 10 }}>
                {s.exercises.map((e, i) => (
                  <div key={i} style={{ fontSize: '.9rem', marginBottom: 6 }}>
                    <strong>{exMap.get(e.exerciseId)?.name ?? e.exerciseId}</strong>
                    <div className="muted">
                      {e.sets.map((st, k) => (
                        <span key={k} style={{ marginRight: 8, textDecoration: st.done ? 'none' : 'line-through' }}>{st.reps}{st.load ? `×${st.load}kg` : ''}</span>
                      ))}
                    </div>
                  </div>
                ))}
                {s.notes && <p className="muted" style={{ fontSize: '.85rem' }}>📝 {s.notes}</p>}
                <button className="btn-sm btn-danger" onClick={() => { if (confirm('Excluir esta sessão?')) removeSession(s.id) }}>Excluir sessão</button>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
