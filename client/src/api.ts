const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001'

function getToken(): string | null {
  return localStorage.getItem('auth_token')
}

export function setToken(token: string): void {
  localStorage.setItem('auth_token', token)
}

export function clearToken(): void {
  localStorage.removeItem('auth_token')
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken()
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  }
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  const res = await fetch(`${API_BASE}${path}`, { ...options, headers })

  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(body.error || `Request failed with status ${res.status}`)
  }

  return res.json()
}

// Auth API
export interface AuthUser {
  id: number
  email: string
  displayName: string
}

interface AuthResponse {
  token: string
  user: AuthUser
}

export async function register(email: string, password: string, displayName: string): Promise<AuthResponse> {
  return request('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify({ email, password, displayName }),
  })
}

export async function login(email: string, password: string): Promise<AuthResponse> {
  return request('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  })
}

export async function getMe(): Promise<AuthUser> {
  return request('/api/auth/me')
}

// Cards API
export interface CardData {
  id: string
  listId: string
  title: string
  description: string
  timeCompleted: string
  notes: string
  techniques: string[]
  websiteUrl: string
  difficulty: string
  dataStructures: string[]
  position: number
  createdAt: string
  updatedAt: string
}

export async function fetchBoard(): Promise<Record<string, CardData[]>> {
  const res = await request<{ board: Record<string, CardData[]> }>('/api/cards')
  return res.board
}

export async function createCard(card: Omit<CardData, 'position' | 'updatedAt'>): Promise<CardData> {
  const res = await request<{ card: CardData }>('/api/cards', {
    method: 'POST',
    body: JSON.stringify(card),
  })
  return res.card
}

export async function updateCard(id: string, data: Partial<CardData>): Promise<CardData> {
  const res = await request<{ card: CardData }>(`/api/cards/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  })
  return res.card
}

export async function moveCard(id: string, listId: string): Promise<CardData> {
  const res = await request<{ card: CardData }>(`/api/cards/${id}/move`, {
    method: 'PATCH',
    body: JSON.stringify({ listId }),
  })
  return res.card
}

export async function deleteCard(id: string): Promise<void> {
  await request(`/api/cards/${id}`, { method: 'DELETE' })
}
