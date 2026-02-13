// Theriotypes disponibles en la app
export const THERIOTYPES = [
  { id: 'wolf', name: 'Lobo', emoji: '🐺', category: 'mammal' },
  { id: 'fox', name: 'Zorro', emoji: '🦊', category: 'mammal' },
  { id: 'cat', name: 'Gato', emoji: '🐱', category: 'mammal' },
  { id: 'dog', name: 'Perro', emoji: '🐕', category: 'mammal' },
  { id: 'bear', name: 'Oso', emoji: '🐻', category: 'mammal' },
  { id: 'lion', name: 'León', emoji: '🦁', category: 'mammal' },
  { id: 'tiger', name: 'Tigre', emoji: '🐯', category: 'mammal' },
  { id: 'deer', name: 'Ciervo', emoji: '🦌', category: 'mammal' },
  { id: 'rabbit', name: 'Conejo', emoji: '🐰', category: 'mammal' },
  { id: 'raccoon', name: 'Mapache', emoji: '🦝', category: 'mammal' },
  { id: 'bat', name: 'Murciélago', emoji: '🦇', category: 'mammal' },
  { id: 'otter', name: 'Nutria', emoji: '🦦', category: 'mammal' },
  { id: 'horse', name: 'Caballo', emoji: '🐴', category: 'mammal' },
  { id: 'owl', name: 'Búho', emoji: '🦉', category: 'bird' },
  { id: 'eagle', name: 'Águila', emoji: '🦅', category: 'bird' },
  { id: 'crow', name: 'Cuervo', emoji: '🐦‍⬛', category: 'bird' },
  { id: 'raven', name: 'Cuervo (Raven)', emoji: '🐦', category: 'bird' },
  { id: 'snake', name: 'Serpiente', emoji: '🐍', category: 'reptile' },
  { id: 'dragon', name: 'Dragón', emoji: '🐉', category: 'mythical' },
  { id: 'phoenix', name: 'Fénix', emoji: '🔥', category: 'mythical' },
  { id: 'other', name: 'Otro', emoji: '✨', category: 'other' }
]

// Intenciones de conexión
export const CONNECTION_INTENTIONS = [
  { id: 'friendship', label: 'Amistad' },
  { id: 'romance', label: 'Romance' },
  { id: 'community', label: 'Comunidad' },
  { id: 'all', label: 'Todo' }
]

// Géneros
export const GENDERS = [
  { id: 'non-binary', label: 'No binario' },
  { id: 'male', label: 'Hombre' },
  { id: 'female', label: 'Mujer' },
  { id: 'other', label: 'Otro' },
  { id: 'prefer-not-to-say', label: 'Prefiero no decir' }
]

// Distancias para filtros
export const DISTANCES = [
  { id: 10, label: '10 km' },
  { id: 50, label: '50 km' },
  { id: 100, label: '100 km' },
  { id: 999999, label: 'Cualquier lugar' }
]

// Límites del sistema
export const LIMITS = {
  MAX_DAILY_LIKES: 100,
  MAX_BIO_LENGTH: 300,
  MAX_PHOTOS: 6,
  MIN_PHOTOS: 1,
  MIN_AGE: 18,
  MAX_AGE: 45
}

// Colores del tema
export const COLORS = {
  background: '#0F0F12',
  gold: '#C8A96E',
  like: '#4ADE80',
  nope: '#F87171',
  superLike: '#60A5FA'
}
