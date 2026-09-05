import type { SetPlan, WorkoutType } from '../types'

export interface TemplateExercise {
  exerciseId: string
  sets: SetPlan[]
  notes?: string
}

export interface WorkoutTemplate {
  id: string
  name: string
  type: WorkoutType
  goal: string
  description: string
  durationMin: number
  exercises: TemplateExercise[]
}

const sets = (n: number, reps: string, rest: number, load?: string): SetPlan[] =>
  Array.from({ length: n }, () => ({ reps, rest, load }))

export const TEMPLATES: WorkoutTemplate[] = [
  {
    id: 'tpl-forca-a',
    name: 'Força A — Inferiores + Puxada',
    type: 'musculacao',
    goal: 'Força máxima',
    description: 'Base de força para quedas, guarda e controle. 2x por semana em fase de base.',
    durationMin: 60,
    exercises: [
      { exerciseId: 'agachamento-livre', sets: sets(4, '5', 180) },
      { exerciseId: 'terra-romeno', sets: sets(3, '8', 120) },
      { exerciseId: 'barra-fixa', sets: sets(4, '6-8', 120), notes: 'Adicionar carga se fizer mais de 8.' },
      { exerciseId: 'remada-unilateral', sets: sets(3, '10 cada lado', 90) },
      { exerciseId: 'pallof-press', sets: sets(3, '12 cada lado', 60) },
      { exerciseId: 'farmer-walk', sets: sets(3, '40 m', 90) },
    ],
  },
  {
    id: 'tpl-forca-b',
    name: 'Força B — Posterior + Empurrada',
    type: 'musculacao',
    goal: 'Força máxima',
    description: 'Complementa o Força A. Posterior de coxa, empurrar e pescoço.',
    durationMin: 60,
    exercises: [
      { exerciseId: 'levantamento-terra', sets: sets(4, '4', 180) },
      { exerciseId: 'agachamento-bulgaro', sets: sets(3, '8 cada perna', 90) },
      { exerciseId: 'supino-reto', sets: sets(4, '5', 150) },
      { exerciseId: 'landmine-press', sets: sets(3, '8 cada lado', 90) },
      { exerciseId: 'face-pull', sets: sets(3, '15', 60) },
      { exerciseId: 'pescoco-elastico', sets: sets(2, '15 cada direção', 45) },
      { exerciseId: 'prancha-lateral', sets: sets(3, '40 s cada lado', 45) },
    ],
  },
  {
    id: 'tpl-hipertrofia-superior',
    name: 'Hipertrofia — Superiores',
    type: 'musculacao',
    goal: 'Hipertrofia',
    description: 'Volume para ganhar massa em costas, ombros e braços sem perder pegada.',
    durationMin: 65,
    exercises: [
      { exerciseId: 'puxada-alta', sets: sets(4, '10-12', 75) },
      { exerciseId: 'supino-inclinado-halter', sets: sets(4, '10-12', 75) },
      { exerciseId: 'remada-cavalinho', sets: sets(3, '10-12', 75) },
      { exerciseId: 'desenvolvimento-halter', sets: sets(3, '10-12', 75) },
      { exerciseId: 'rosca-martelo', sets: sets(3, '12', 60) },
      { exerciseId: 'triceps-corda', sets: sets(3, '12-15', 60) },
      { exerciseId: 'dead-hang', sets: sets(3, 'máximo', 90) },
    ],
  },
  {
    id: 'tpl-hipertrofia-inferior',
    name: 'Hipertrofia — Inferiores + Core',
    type: 'musculacao',
    goal: 'Hipertrofia',
    description: 'Volume para pernas e glúteos, com core anti-rotação.',
    durationMin: 60,
    exercises: [
      { exerciseId: 'agachamento-frontal', sets: sets(4, '8-10', 120) },
      { exerciseId: 'hip-thrust', sets: sets(4, '10-12', 90) },
      { exerciseId: 'leg-press', sets: sets(3, '12-15', 90) },
      { exerciseId: 'nordic-curl', sets: sets(3, '6-8', 90) },
      { exerciseId: 'panturrilha', sets: sets(4, '15', 45) },
      { exerciseId: 'abdominal-infra', sets: sets(3, '12', 60) },
      { exerciseId: 'ab-wheel', sets: sets(3, '10', 60) },
    ],
  },
  {
    id: 'tpl-potencia',
    name: 'Potência — Quedas e Raspagens',
    type: 'musculacao',
    goal: 'Potência',
    description: 'Movimentos explosivos com baixa repetição e descanso completo. Ideal em fase pré-competição.',
    durationMin: 50,
    exercises: [
      { exerciseId: 'power-clean', sets: sets(5, '3', 150), notes: 'Foco em velocidade, não em carga máxima.' },
      { exerciseId: 'box-jump', sets: sets(4, '5', 90) },
      { exerciseId: 'kettlebell-swing', sets: sets(4, '10', 90) },
      { exerciseId: 'med-ball-rotacional', sets: sets(4, '6 cada lado', 90) },
      { exerciseId: 'push-press', sets: sets(4, '5', 120) },
      { exerciseId: 'sprawl', sets: sets(3, '10', 60) },
    ],
  },
  {
    id: 'tpl-grip-pescoco',
    name: 'Pegada e Pescoço',
    type: 'musculacao',
    goal: 'Pegada / pescoço',
    description: 'Sessão curta e específica, ideal após o treino de tatame ou como treino extra.',
    durationMin: 30,
    exercises: [
      { exerciseId: 'barra-fixa-kimono', sets: sets(4, '5-8', 120) },
      { exerciseId: 'dead-hang-kimono', sets: sets(3, 'máximo', 90) },
      { exerciseId: 'remada-toalha', sets: sets(3, '10', 75) },
      { exerciseId: 'plate-pinch', sets: sets(3, '30 s', 60) },
      { exerciseId: 'rosca-punho', sets: sets(3, '15', 45) },
      { exerciseId: 'ponte-pescoco', sets: sets(3, '20 s', 60), notes: 'Sem rolar sobre a cabeça. Progredir devagar.' },
      { exerciseId: 'flexao-pescoco-anilha', sets: sets(3, '12', 45) },
    ],
  },
  {
    id: 'tpl-cond-round',
    name: 'Condicionamento — Simulação de Round',
    type: 'condicionamento',
    goal: 'Resistência específica',
    description: '5 rounds de 5 minutos com 1 minuto de descanso, simulando a luta. Fazer circuito contínuo dentro de cada round.',
    durationMin: 35,
    exercises: [
      { exerciseId: 'burpee', sets: sets(5, '30 s', 0) },
      { exerciseId: 'kettlebell-swing', sets: sets(5, '30 s', 0) },
      { exerciseId: 'sprawl', sets: sets(5, '30 s', 0) },
      { exerciseId: 'shrimp', sets: sets(5, '30 s', 0) },
      { exerciseId: 'battle-rope', sets: sets(5, '30 s', 0) },
      { exerciseId: 'technical-standup', sets: sets(5, '30 s', 0) },
      { exerciseId: 'bear-crawl', sets: sets(5, '30 s', 0) },
      { exerciseId: 'ponte-gluteo', sets: sets(5, '30 s', 0) },
      { exerciseId: 'carregar-saco', sets: sets(5, '30 s', 0) },
      { exerciseId: 'mountain-climber', sets: sets(5, '30 s', 60), notes: '1 min de descanso entre rounds.' },
    ],
  },
  {
    id: 'tpl-cond-hiit',
    name: 'Condicionamento — HIIT Anaeróbio',
    type: 'condicionamento',
    goal: 'Capacidade anaeróbia',
    description: 'Intervalos curtos e intensos com descanso 1:2. Melhora explosões repetidas na luta.',
    durationMin: 30,
    exercises: [
      { exerciseId: 'assault-bike', sets: sets(8, '20 s máximo', 40) },
      { exerciseId: 'sled-push', sets: sets(6, '20 m', 60) },
      { exerciseId: 'med-ball-slam', sets: sets(6, '10', 45) },
      { exerciseId: 'wall-ball', sets: sets(4, '15', 60) },
    ],
  },
  {
    id: 'tpl-cond-aerobio',
    name: 'Condicionamento — Base Aeróbia',
    type: 'condicionamento',
    goal: 'Capacidade aeróbia',
    description: 'Intensidade moderada e constante (zona 2). Ajuda a recuperar entre rounds e entre treinos.',
    durationMin: 40,
    exercises: [
      { exerciseId: 'remo-ergometro', sets: [{ reps: '20 min zona 2', rest: 120 }] },
      { exerciseId: 'pular-corda', sets: sets(5, '2 min', 30) },
      { exerciseId: 'sled-pull', sets: sets(4, '30 m leve', 60) },
    ],
  },
  {
    id: 'tpl-cond-circuito-forca',
    name: 'Condicionamento — Circuito de Força',
    type: 'condicionamento',
    goal: 'Força-resistência',
    description: '4 voltas no circuito, 40 s de trabalho / 20 s de transição. Descanso de 2 min entre voltas.',
    durationMin: 35,
    exercises: [
      { exerciseId: 'salto-agachamento', sets: sets(4, '40 s', 20) },
      { exerciseId: 'remada-anel', sets: sets(4, '40 s', 20) },
      { exerciseId: 'flexao', sets: sets(4, '40 s', 20) },
      { exerciseId: 'afundo', sets: sets(4, '40 s', 20) },
      { exerciseId: 'farmer-walk', sets: sets(4, '40 s', 20) },
      { exerciseId: 'hollow-hold', sets: sets(4, '40 s', 120) },
    ],
  },
  {
    id: 'tpl-mobilidade',
    name: 'Mobilidade e Recuperação',
    type: 'condicionamento',
    goal: 'Mobilidade',
    description: 'Sessão leve para dias de descanso ou antes do treino de tatame.',
    durationMin: 25,
    exercises: [
      { exerciseId: 'gato-camelo', sets: sets(2, '10', 0) },
      { exerciseId: 'rotacao-toracica', sets: sets(2, '8 cada lado', 0) },
      { exerciseId: 'mobilidade-quadril-90-90', sets: sets(2, '8 cada lado', 0) },
      { exerciseId: 'cossack-squat', sets: sets(2, '8 cada lado', 0) },
      { exerciseId: 'deslocamento-ombro', sets: sets(2, '10', 0) },
      { exerciseId: 'alongamento-flexores', sets: sets(2, '45 s cada lado', 0) },
      { exerciseId: 'granby-roll', sets: sets(2, '5 cada lado', 0) },
      { exerciseId: 'turkish-getup', sets: sets(2, '3 cada lado', 60) },
    ],
  },
]
