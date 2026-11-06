import { AKSI, type Aksi } from './permissions';

/**
 * Satu sumber kebenaran untuk sidebar dashboard.png sekaligus untuk route guard.
 * `aksi` diisi => menu hanya tampil/boleh dibuka untuk peran yang berhak (FR-11).
 */
export type ItemNavigasi = {
  nomor: string;
  label: string;
  ke: string;
  aksi?: Aksi;
};

export const MENU_UTAMA: ItemNavigasi[] = [
  { nomor: '01', label: 'Dashboard', ke: '/dashboard', aksi: AKSI.lihatDashboard },
  { nomor: '02', label: 'Riwayat Deteksi', ke: '/riwayat', aksi: AKSI.lihatRiwayat },
  { nomor: '03', label: 'Peta Simulasi', ke: '/peta', aksi: AKSI.lihatPeta },
  { nomor: '04', label: 'Ekspor CSV', ke: '/ekspor', aksi: AKSI.eksporCsv },
  { nomor: '05', label: 'Kelola Akun', ke: '/akun', aksi: AKSI.kelolaAkun },
];
