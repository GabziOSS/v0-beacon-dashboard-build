import { rng, randInt, shuffle } from '../seed'
import type { MockUser } from '../types'

const NAMES = [
  'Rosario Mendoza',
  'Eduardo Santos',
  'Ligaya Reyes',
  'Bernardo Cruz',
  'Amelita Torres',
  'Danilo Castillo',
  'Perla Villanueva',
  'Ricardo Espinosa',
  'Carmen Delgado',
  'Fernando Aquino',
  'Josefina Bautista',
  'Miguel Ramos',
]

const ROLES: MockUser['role'][] = [
  'admin',
  'admin',
  'analyst',
  'analyst',
  'analyst',
  'responder',
  'responder',
  'responder',
  'responder',
  'responder',
  'viewer',
  'viewer',
]

const ORGS = ['CDRRMO', 'PNP Calbayog', 'BFP Calbayog', 'CSRMH']

const ALL_ZONES = Array.from({ length: 12 }, (_, i) => `z${String(i + 1).padStart(2, '0')}`)

// Inactive indices: users 10 and 11 (0-indexed) — one responder, one viewer
const INACTIVE_INDICES = new Set([9, 11])

function initials(name: string): string {
  return name
    .split(' ')
    .map(p => p[0])
    .join('')
}

function email(name: string): string {
  const [first, last] = name.toLowerCase().split(' ')
  return `${first}.${last}@beacon.calbayog.gov.ph`
}

function pickZones(role: MockUser['role']): string[] {
  if (role === 'admin') return [...ALL_ZONES]
  const count =
    role === 'analyst' ? randInt(4, 6) : role === 'responder' ? randInt(2, 4) : randInt(1, 2)
  return shuffle([...ALL_ZONES]).slice(0, count)
}

function isoDate(daysAgo: number): string {
  const base = new Date('2025-03-07T00:00:00Z')
  const ms = base.getTime() - daysAgo * 86_400_000 + randInt(0, 86_400_000 - 1)
  return new Date(ms).toISOString()
}

export function generateUsers(): MockUser[] {
  // Assign orgs round-robin style, shuffled
  const orgAssignments = NAMES.map((_, i) => ORGS[i % ORGS.length])

  return NAMES.map((name, i): MockUser => {
    const role = ROLES[i]
    const inactive = INACTIVE_INDICES.has(i)
    const daysAgo = inactive ? randInt(15, 30) : randInt(0, 7)

    return {
      id: `u${String(i + 1).padStart(2, '0')}`,
      name,
      email: email(name),
      role,
      avatar: initials(name),
      org: orgAssignments[i],
      zones: pickZones(role),
      lastLogin: isoDate(daysAgo),
      status: inactive ? 'inactive' : 'active',
    }
  })
}
