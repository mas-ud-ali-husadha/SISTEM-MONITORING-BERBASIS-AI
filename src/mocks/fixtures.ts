import type { DeteksiResult, MetrikEvaluasi, RingkasanDashboard, SesiPengguna } from '../types/detection';

/**
 * Data dummy supaya FE jalan tanpa backend (M5 minggu 7-9).
 * Matikan dengan cara set VITE_USE_FIXTURES=false di .env.
 * Dua baris pertama sengaja sama dengan tabel "Deteksi Terbaru" di mockup/dashboard.png.
 */

export const sesiDummy: Record<'operator' | 'administrator', SesiPengguna> = {
  operator: { id: 'u-1', username: 'operator', peran: 'operator' },
  administrator: { id: 'u-2', username: 'admin', peran: 'administrator' },
};

const TRANSKRIP_AMAN = [
  'Regensi satu menuju titik kumpul, selesai.',
  'Kendaraan dua siap, tidak ada kendala di jalur.',
  'Laporan situasi kondusif, kembali ke pos.',
];

const TRANSKRIP_TERINDIKASI = [
  'Tolong, ada orang pingsan di dekat pasar, butuh bantuan segera.',
  'Ada tiga orang membawa senjata di ujung jalan, mohon dukungan.',
  'Air naik cepat, warga di blok barat belum dievakuasi.',
];

export const deteksiDummy: DeteksiResult[] = Array.from({ length: 24 }, (_, i) => {
  const n = 24 - i;
  const idx = String(n).padStart(3, '0');
  const terindikasi = n % 3 === 0 || n === 24;

  if (n === 24) {
    return {
      id: 'd-024',
      namaFile: 'sample_radio_024.wav',
      ukuranByte: 4_812_000,
      durasiDetik: 41,
      waktu: '2026-10-24T10:42:00+07:00',
      transkrip: 'Ada tiga orang membawa senjata di ujung jalan, mohon dukungan segera.',
      kataKunciTercocok: ['senjata', 'ujung jalan', 'dukungan segera'],
      kategori: 'ancaman-keamanan',
      prioritas: 'tinggi',
      statusTinjauan: 'perlu-ditinjau',
      statusPemrosesan: 'selesai',
      koordinat: { lat: -6.914, lng: 107.646, labelSimulasi: 'Koordinat simulasi — bukan lokasi nyata' },
    };
  }

  if (n === 23) {
    return {
      id: 'd-023',
      namaFile: 'sample_radio_023.wav',
      ukuranByte: 3_104_000,
      durasiDetik: 28,
      waktu: '2026-10-24T09:18:00+07:00',
      transkrip: 'Regensi dua menuju pos, situasi aman.',
      kataKunciTercocok: [],
      kategori: 'tidak-terkategori',
      prioritas: 'tidak-diketahui',
      statusTinjauan: 'selesai',
      statusPemrosesan: 'selesai',
      koordinat: null,
    };
  }

  const jam = String(8 + (n % 10)).padStart(2, '0');
  const menit = String((n * 7) % 60).padStart(2, '0');

  return terindikasi
    ? {
        id: `d-${idx}`,
        namaFile: `sample_radio_${idx}.wav`,
        ukuranByte: 2_000_000 + n * 51_000,
        durasiDetik: 20 + (n % 40),
        waktu: `2026-10-24T${jam}:${menit}:00+07:00`,
        transkrip: TRANSKRIP_TERINDIKASI[n % TRANSKRIP_TERINDIKASI.length],
        kataKunciTercocok: ['bantuan', 'segera'].slice(0, (n % 2) + 1),
        kategori: n % 2 === 0 ? 'medis' : 'bencana-alam',
        prioritas: n % 4 === 0 ? 'ekstrem' : 'sedang',
        statusTinjauan: n % 2 === 0 ? 'perlu-ditinjau' : 'belum-ditinjau',
        statusPemrosesan: 'selesai',
        koordinat: {
          lat: -6.914 + (n % 7) * 0.004,
          lng: 107.646 + (n % 5) * 0.005,
          labelSimulasi: 'Koordinat simulasi — bukan lokasi nyata',
        },
      }
    : {
        id: `d-${idx}`,
        namaFile: `sample_radio_${idx}.wav`,
        ukuranByte: 1_500_000 + n * 40_000,
        durasiDetik: 15 + (n % 30),
        waktu: `2026-10-24T${jam}:${menit}:00+07:00`,
        transkrip: TRANSKRIP_AMAN[n % TRANSKRIP_AMAN.length],
        kataKunciTercocok: [],
        kategori: 'tidak-terkategori',
        prioritas: 'tidak-diketahui',
        statusTinjauan: 'selesai',
        statusPemrosesan: 'selesai',
        koordinat: null,
      };
});

export const ringkasanDummy: RingkasanDashboard = {
  totalSampel: 24,
  indikasiTerdeteksi: 7,
  menungguTinjauan: 4,
  statusSistem: 'siap',
};

export const metrikDummy: MetrikEvaluasi = {
  precision: null,
  recall: null,
  falsePositive: 0,
  falseNegative: 0,
  jumlahSampelBerlabel: 0,
  catatan: 'Data uji berlabel belum tersedia (FR-13). Metrik akan diisi setelah M3.',
};
