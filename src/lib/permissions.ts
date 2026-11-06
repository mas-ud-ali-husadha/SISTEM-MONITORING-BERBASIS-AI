import type { Peran } from '../types/detection';

/**
 * FR-11 — matriks hak akses. Baris "matriks izin TBD" di SRS berarti tabel ini
 * masih usulan; konfirmasi ke tim sebelum dianggap final.
 *
 * Guard route dan penanda "ADMIN ONLY" di sidebar sama-sama membaca peta ini,
 * supaya tidak ada dua sumber kebenaran tentang siapa boleh apa.
 */
export const AKSI = {
  lihatDashboard: 'lihatDashboard',
  lihatRiwayat: 'lihatRiwayat',
  lihatPeta: 'lihatPeta',
  unggahAudio: 'unggahAudio',
  tinjauPeringatan: 'tinjauPeringatan',
  eksporCsv: 'eksporCsv',
  kelolaAkun: 'kelolaAkun',
} as const;

export type Aksi = (typeof AKSI)[keyof typeof AKSI];

const HAK: Record<Peran, ReadonlySet<Aksi>> = {
  operator: new Set<Aksi>([
    AKSI.lihatDashboard,
    AKSI.lihatRiwayat,
    AKSI.lihatPeta,
    AKSI.unggahAudio,
    AKSI.tinjauPeringatan,
  ]),
  administrator: new Set<Aksi>(Object.values(AKSI)),
};

export function boleh(peran: Peran | undefined, aksi: Aksi): boolean {
  if (!peran) return false;
  return HAK[peran].has(aksi);
}
