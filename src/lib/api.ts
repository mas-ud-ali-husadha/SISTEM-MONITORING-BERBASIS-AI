import { deteksiDummy, metrikDummy, ringkasanDummy, sesiDummy } from '../mocks/fixtures';
import type {
  DeteksiResult,
  FilterRiwayat,
  KesalahanApi,
  MetrikEvaluasi,
  Peran,
  RingkasanDashboard,
  SesiPengguna,
  StatusTinjauan,
} from '../types/detection';

/**
 * Lapisan API. Komponen tidak memanggil fetch langsung, hanya fungsi di file ini,
 * supaya perpindahan fixture -> backend asli tidak menyentuh UI.
 *
 * Mode fixture aktif selama VITE_USE_FIXTURES bukan 'false' (default ON),
 * jadi `npm run dev` tetap jalan walau backend belum ada.
 */

const PAKAI_FIXTURE = import.meta.env.VITE_USE_FIXTURES !== 'false';
const BASE = '/api';

export class ApiError extends Error {
  kode: string;
  tindakan?: string;

  constructor(e: KesalahanApi) {
    super(e.pesan);
    this.name = 'ApiError';
    this.kode = e.kode;
    this.tindakan = e.tindakan;
  }
}

async function requestJson<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    // FR-01/NFR-03: sesi lewat httpOnly cookie, token tidak pernah masuk JS.
    credentials: 'include',
    ...init,
  });

  if (!res.ok) {
    const body = (await res.json().catch(() => null)) as KesalahanApi | null;
    throw new ApiError(
      body ?? {
        kode: `HTTP_${res.status}`,
        pesan: `Permintaan gagal (${res.status}).`,
        tindakan: 'Coba lagi beberapa saat, atau pastikan backend berjalan di port 8000.',
      }
    );
  }

  if (res.status === 204) return undefined as T;
  return (await res.json()) as T;
}

/** Delay buatan supaya state "memproses" terlihat saat mode fixture. */
function simulasiLatensi<T>(value: T, ms = 220): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}

function saring(rows: DeteksiResult[], f: FilterRiwayat): DeteksiResult[] {
  return rows.filter((r) => {
    if (f.q) {
      const q = f.q.toLowerCase();
      if (!r.namaFile.toLowerCase().includes(q) && !r.transkrip.toLowerCase().includes(q)) return false;
    }
    if (f.kategori && r.kategori !== f.kategori) return false;
    if (f.prioritas && r.prioritas !== f.prioritas) return false;
    if (f.statusTinjauan && r.statusTinjauan !== f.statusTinjauan) return false;
    if (f.dari && r.waktu < f.dari) return false;
    if (f.sampai && r.waktu > f.sampai) return false;
    return true;
  });
}

/**
 * Mode fixture saja: menyimpan peran yang sedang dipakai demo supaya halaman
 * admin-only (FR-11) tetap bisa dibuka setelah refresh. Ini bukan kredensial —
 * di mode backend, sesi datang dari httpOnly cookie dan tidak ada state di JS.
 */
const KUNCI_PERAN_DEMO = 'demo-peran';

function peranDemo(): Peran {
  return sessionStorage.getItem(KUNCI_PERAN_DEMO) === 'administrator' ? 'administrator' : 'operator';
}

export function ambilSesi(): Promise<SesiPengguna | null> {
  if (PAKAI_FIXTURE) return simulasiLatensi(sesiDummy[peranDemo()]);
  return requestJson<SesiPengguna | null>('/me');
}

export function masuk(username: string, password: string): Promise<SesiPengguna> {
  if (PAKAI_FIXTURE) {
    const peran: Peran = username === 'admin' ? 'administrator' : 'operator';
    sessionStorage.setItem(KUNCI_PERAN_DEMO, peran);
    return simulasiLatensi(sesiDummy[peran]);
  }
  return requestJson<SesiPengguna>('/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });
}

export function keluar(): Promise<void> {
  if (PAKAI_FIXTURE) {
    sessionStorage.removeItem(KUNCI_PERAN_DEMO);
    return simulasiLatensi(undefined);
  }
  return requestJson<void>('/auth/logout', { method: 'POST' });
}

export function ambilRingkasan(): Promise<RingkasanDashboard> {
  if (PAKAI_FIXTURE) return simulasiLatensi(ringkasanDummy);
  return requestJson<RingkasanDashboard>('/dashboard/ringkasan');
}

export function ambilRiwayat(filter: FilterRiwayat): Promise<DeteksiResult[]> {
  if (PAKAI_FIXTURE) return simulasiLatensi(saring(deteksiDummy, filter));
  const qs = new URLSearchParams(
    Object.entries(filter).filter(([, v]) => v !== undefined && v !== '') as [string, string][]
  );
  return requestJson<DeteksiResult[]>(`/riwayat?${qs.toString()}`);
}

export function ambilDeteksi(id: string): Promise<DeteksiResult> {
  if (PAKAI_FIXTURE) {
    const found = deteksiDummy.find((d) => d.id === id);
    if (!found) return Promise.reject(new ApiError({ kode: 'NOT_FOUND', pesan: `Sampel ${id} tidak ditemukan.` }));
    return simulasiLatensi(found);
  }
  return requestJson<DeteksiResult>(`/riwayat/${encodeURIComponent(id)}`);
}

export function ambilMetrik(): Promise<MetrikEvaluasi> {
  if (PAKAI_FIXTURE) return simulasiLatensi(metrikDummy);
  return requestJson<MetrikEvaluasi>('/evaluasi/metrik');
}

/** FR-14 — operator/admin mencatat bahwa peringatan sudah ditinjau. */
export function ubahStatusTinjauan(id: string, statusBaru: StatusTinjauan): Promise<DeteksiResult> {
  if (PAKAI_FIXTURE) {
    const idx = deteksiDummy.findIndex((d) => d.id === id);
    if (idx === -1) {
      return Promise.reject(new ApiError({ kode: 'NOT_FOUND', pesan: `Sampel ${id} tidak ditemukan.` }));
    }
    deteksiDummy[idx] = { ...deteksiDummy[idx], statusTinjauan: statusBaru };
    return simulasiLatensi(deteksiDummy[idx]);
  }
  return requestJson<DeteksiResult>(`/riwayat/${encodeURIComponent(id)}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ statusTinjauan: statusBaru }),
  });
}

/**
 * FR-12 + NFR-04: ekspor HARUS lewat backend supaya aksinya tercatat di audit log.
 * Jangan diganti jadi pembuatan Blob dari data yang sudah ada di browser.
 */
export async function eksporCsv(): Promise<void> {
  if (PAKAI_FIXTURE) {
    await simulasiLatensi(undefined);
    throw new ApiError({
      kode: 'FIXTURE_NO_EXPORT',
      pesan: 'Ekspor CSV tidak tersedia di mode fixture.',
      tindakan: 'Set VITE_USE_FIXTURES=false dan jalankan backend untuk menguji FR-12.',
    });
  }

  const res = await fetch(`${BASE}/riwayat/ekspor.csv`, {
    method: 'POST',
    credentials: 'include',
    headers: { Accept: 'text/csv' },
  });

  if (!res.ok) {
    const body = (await res.json().catch(() => null)) as KesalahanApi | null;
    throw new ApiError(body ?? { kode: `HTTP_${res.status}`, pesan: 'Ekspor gagal.' });
  }

  const blob = await res.blob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `riwayat-deteksi-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

/** FR-02 — unggah sampel WAV. Batas ukuran dan durasi ditegakkan di sini dan di backend. */
export const BATAS_UKURAN_MB = 50;

export function unggahAudio(file: File): Promise<DeteksiResult> {
  if (file.size > BATAS_UKURAN_MB * 1024 * 1024) {
    throw new ApiError({
      kode: 'FILE_TOO_LARGE',
      pesan: `Ukuran file ${(file.size / 1024 / 1024).toFixed(1)} MB melebihi batas ${BATAS_UKURAN_MB} MB.`,
      tindakan: 'Potong rekaman menjadi bagian yang lebih pendek, lalu unggah ulang.',
    });
  }
  if (!file.name.toLowerCase().endsWith('.wav')) {
    throw new ApiError({
      kode: 'FORMAT_INVALID',
      pesan: `Berkas ${file.name} bukan format WAV.`,
      tindakan: 'Konversi ke WAV (PCM 16-bit) sebelum diunggah.',
    });
  }

  if (PAKAI_FIXTURE) {
    const baru: DeteksiResult = {
      ...deteksiDummy[0],
      id: `d-baru-${Date.now()}`,
      namaFile: file.name,
      ukuranByte: file.size,
      waktu: new Date().toISOString(),
      statusPemrosesan: 'memproses',
      statusTinjauan: 'belum-ditinjau',
    };
    return simulasiLatensi(baru, 400);
  }

  const form = new FormData();
  form.append('file', file);
  return requestJson<DeteksiResult>('/audio', { method: 'POST', body: form });
}
