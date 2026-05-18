import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  query,
  where,
  orderBy,
} from 'firebase/firestore'
import { db } from './firebase'
import { Santri, Guru, Kelas, Absensi, Penilaian, Pembayaran } from './types'

const now = () => new Date().toISOString()

// Simple in-memory cache
const cache: Record<string, { data: any; ts: number }> = {}
const CACHE_TTL = 30_000 // 30 detik

function getCache<T>(key: string): T | null {
  const entry = cache[key]
  if (entry && Date.now() - entry.ts < CACHE_TTL) return entry.data as T
  return null
}

function setCache(key: string, data: any) {
  cache[key] = { data, ts: Date.now() }
}

function clearCache(key: string) {
  delete cache[key]
}

// ─── SANTRI ───────────────────────────────────────────────
export async function getSantri(): Promise<Santri[]> {
  const cached = getCache<Santri[]>('santri')
  if (cached) return cached
  const q = query(collection(db, 'santri'), orderBy('nama'))
  const snap = await getDocs(q)
  const data = snap.docs.map(d => ({ id: d.id, ...d.data() } as Santri))
  setCache('santri', data)
  return data
}

export async function addSantri(data: Omit<Santri, 'id'>) {
  clearCache('santri')
  return addDoc(collection(db, 'santri'), { ...data, createdAt: now(), updatedAt: now() })
}

export async function updateSantri(id: string, data: Partial<Santri>) {
  clearCache('santri')
  return updateDoc(doc(db, 'santri', id), { ...data, updatedAt: now() })
}

export async function deleteSantri(id: string) {
  clearCache('santri')
  return deleteDoc(doc(db, 'santri', id))
}

// ─── GURU ─────────────────────────────────────────────────
export async function getGuru(): Promise<Guru[]> {
  const cached = getCache<Guru[]>('guru')
  if (cached) return cached
  const q = query(collection(db, 'guru'), orderBy('nama'))
  const snap = await getDocs(q)
  const data = snap.docs.map(d => ({ id: d.id, ...d.data() } as Guru))
  setCache('guru', data)
  return data
}

export async function addGuru(data: Omit<Guru, 'id'>) {
  clearCache('guru')
  return addDoc(collection(db, 'guru'), { ...data, createdAt: now(), updatedAt: now() })
}

export async function updateGuru(id: string, data: Partial<Guru>) {
  clearCache('guru')
  return updateDoc(doc(db, 'guru', id), { ...data, updatedAt: now() })
}

export async function deleteGuru(id: string) {
  clearCache('guru')
  return deleteDoc(doc(db, 'guru', id))
}

// ─── KELAS ────────────────────────────────────────────────
export async function getKelas(): Promise<Kelas[]> {
  const cached = getCache<Kelas[]>('kelas')
  if (cached) return cached
  const snap = await getDocs(collection(db, 'kelas'))
  const data = snap.docs.map(d => ({ id: d.id, ...d.data() } as Kelas))
  setCache('kelas', data)
  return data
}

export async function addKelas(data: Omit<Kelas, 'id'>) {
  clearCache('kelas')
  return addDoc(collection(db, 'kelas'), { ...data, createdAt: now() })
}

export async function updateKelas(id: string, data: Partial<Kelas>) {
  clearCache('kelas')
  return updateDoc(doc(db, 'kelas', id), data)
}

export async function deleteKelas(id: string) {
  clearCache('kelas')
  return deleteDoc(doc(db, 'kelas', id))
}

// ─── ABSENSI ──────────────────────────────────────────────
export async function getAbsensi(tanggal?: string, kelasId?: string): Promise<Absensi[]> {
  let q = query(collection(db, 'absensi'), orderBy('tanggal', 'desc'))
  if (tanggal && kelasId) {
    q = query(collection(db, 'absensi'),
      where('tanggal', '==', tanggal),
      where('kelasId', '==', kelasId))
  } else if (tanggal) {
    q = query(collection(db, 'absensi'), where('tanggal', '==', tanggal))
  } else if (kelasId) {
    q = query(collection(db, 'absensi'), where('kelasId', '==', kelasId))
  }
  const snap = await getDocs(q)
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as Absensi))
}

export async function addAbsensi(data: Omit<Absensi, 'id'>) {
  return addDoc(collection(db, 'absensi'), { ...data, createdAt: now() })
}

export async function updateAbsensi(id: string, data: Partial<Absensi>) {
  return updateDoc(doc(db, 'absensi', id), data)
}

// ─── PENILAIAN ────────────────────────────────────────────
export async function getPenilaian(santriId?: string): Promise<Penilaian[]> {
  let q = query(collection(db, 'penilaian'), orderBy('tanggal', 'desc'))
  if (santriId) {
    q = query(collection(db, 'penilaian'),
      where('santriId', '==', santriId),
      orderBy('tanggal', 'desc'))
  }
  const snap = await getDocs(q)
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as Penilaian))
}

export async function addPenilaian(data: Omit<Penilaian, 'id'>) {
  return addDoc(collection(db, 'penilaian'), { ...data, createdAt: now() })
}

export async function updatePenilaian(id: string, data: Partial<Penilaian>) {
  return updateDoc(doc(db, 'penilaian', id), data)
}

export async function deletePenilaian(id: string) {
  return deleteDoc(doc(db, 'penilaian', id))
}

// ─── PEMBAYARAN ───────────────────────────────────────────
export async function getPembayaran(santriId?: string): Promise<Pembayaran[]> {
  let q = query(collection(db, 'pembayaran'), orderBy('tahun', 'desc'))
  if (santriId) {
    q = query(collection(db, 'pembayaran'), where('santriId', '==', santriId))
  }
  const snap = await getDocs(q)
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as Pembayaran))
}

export async function addPembayaran(data: Omit<Pembayaran, 'id'>) {
  return addDoc(collection(db, 'pembayaran'), { ...data, createdAt: now() })
}

export async function updatePembayaran(id: string, data: Partial<Pembayaran>) {
  return updateDoc(doc(db, 'pembayaran', id), data)
}

export async function deletePembayaran(id: string) {
  return deleteDoc(doc(db, 'pembayaran', id))
}
