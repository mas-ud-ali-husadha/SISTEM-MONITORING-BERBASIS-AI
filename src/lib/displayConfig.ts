import type { KategoriIndikasi, Peran, Prioritas, StatusPemrosesan, StatusTinjauan } from '../types/detection';

/**
 * NFR-12 — pemetaan label dan tampilan ke kelas Tailwind, di SATU tempat.
 *
 * Definisi prioritas dan kategori masih TBD (BRS 3.3 R-04, SRS FR-05).
 * Saat pedoman final disepakati, cukup ubah file ini — tidak ada komponen
 * yang hardcode warna atau teks.
 */

export const prioritasTampilan: Record<Prioritas, { label: string; badgeClass: string; warna: string }> = {
  rendah: { label: 'Rendah', badgeClass: 'text-priority-rendah border-priority-rendah', warna: 'var(--color-priority-rendah)' },
  sedang: { label: 'Sedang', badgeClass: 'text-priority-sedang border-priority-sedang', warna: 'var(--color-priority-sedang)' },
  tinggi: { label: 'Tinggi', badgeClass: 'text-priority-tinggi border-priority-tinggi', warna: 'var(--color-priority-tinggi)' },
  ekstrem: { label: 'Ekstrem', badgeClass: 'text-priority-ekstrem border-priority-ekstrem', warna: 'var(--color-priority-ekstrem)' },
  'tidak-diketahui': { label: 'Tidak diketahui', badgeClass: 'text-ink-faint border-line', warna: 'var(--color-ink-faint)' },
};

export const kategoriLabel: Record<KategoriIndikasi, string> = {
  'ancaman-keamanan': 'Ancaman keamanan',
  'bencana-alam': 'Bencana alam',
  medis: 'Medis',
  penganiayaan: 'Penganiayaan',
  perampokan: 'Perampokan',
  'tidak-terkategori': 'Tidak terkategori',
};

export const statusTinjauanTampilan: Record<StatusTinjauan, { label: string; badgeClass: string }> = {
  'belum-ditinjau': { label: 'Belum ditinjau', badgeClass: 'border-line text-ink-muted' },
  'perlu-ditinjau': { label: 'Perlu ditinjau', badgeClass: 'border-ink bg-surface-sunken text-ink' },
  ditinjau: { label: 'Ditinjau', badgeClass: 'border-line text-ink-soft' },
  selesai: { label: 'Selesai', badgeClass: 'border-line text-ink-muted' },
};

/**
 * FR-03 + NFR-09. `gagal` harus tampil sebagai kegagalan, bukan hasil kosong
 * yang terlihat seperti berhasil.
 */
export const statusPemrosesanTampilan: Record<StatusPemrosesan, { label: string; badgeClass: string }> = {
  antre: { label: 'Mengantre', badgeClass: 'border-line text-ink-muted' },
  memproses: { label: 'Memproses', badgeClass: 'border-ink text-ink' },
  selesai: { label: 'Selesai', badgeClass: 'border-line text-ink-muted' },
  gagal: { label: 'Gagal', badgeClass: 'border-priority-ekstrem text-priority-ekstrem' },
};

/** Nama peran untuk header, sesuai label di mockup/dashboard.png. */
export const peranLabel: Record<Peran, string> = {
  operator: 'Operator Sistem',
  administrator: 'Administrator Sistem',
};

export function labelPrioritas(p: Prioritas): string {
  return prioritasTampilan[p].label;
}
