import { HashRouter, NavLink, Route, Routes } from 'react-router-dom'
import HomePage from './pages/HomePage'
import WorkoutsPage from './pages/WorkoutsPage'
import WorkoutEditorPage from './pages/WorkoutEditorPage'
import TemplatesPage from './pages/TemplatesPage'
import ExercisesPage from './pages/ExercisesPage'
import HistoryPage from './pages/HistoryPage'
import SessionPage from './pages/SessionPage'

const tabs = [
  { to: '/', label: 'Início', icon: '🏠' },
  { to: '/treinos', label: 'Treinos', icon: '📋' },
  { to: '/modelos', label: 'Modelos', icon: '🥋' },
  { to: '/exercicios', label: 'Exercícios', icon: '🏋️' },
  { to: '/historico', label: 'Histórico', icon: '📈' },
]

export default function App() {
  return (
    <HashRouter>
      <div className="app">
        <header className="topbar">
          <span className="brand">BJJ TREINOS</span>
          <small>Musculação e condicionamento para jiu jitsu</small>
        </header>
        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/treinos" element={<WorkoutsPage />} />
            <Route path="/treinos/novo" element={<WorkoutEditorPage />} />
            <Route path="/treinos/:id" element={<WorkoutEditorPage />} />
            <Route path="/treinos/:id/executar" element={<SessionPage />} />
            <Route path="/modelos" element={<TemplatesPage />} />
            <Route path="/exercicios" element={<ExercisesPage />} />
            <Route path="/historico" element={<HistoryPage />} />
          </Routes>
        </main>
        <nav className="tabbar">
          {tabs.map((t) => (
            <NavLink key={t.to} to={t.to} end={t.to === '/'} className={({ isActive }) => (isActive ? 'active' : '')}>
              <span className="icon">{t.icon}</span>
              {t.label}
            </NavLink>
          ))}
        </nav>
      </div>
    </HashRouter>
  )
}
