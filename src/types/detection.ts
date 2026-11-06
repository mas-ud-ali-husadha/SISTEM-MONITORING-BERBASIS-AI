import { z } from 'zod';

/**
 * Kontrak data FE <-> BE, diturunkan dari FR-01..FR-14 dan NFR-08/NFR-09.
 *
 * Konvensi: identifier bahasa Inggris (ikut backend Python), komentar dan label
 * UI bahasa Indonesia (ikut SRS dan mockup).
 *
 * Kalau backend sudah pakai FastAPI, generasi file ini dari OpenAPI spec
 * (`npx openapi-typescript`) supaya tidak ada dua sumber kebenaran.
 */

/** FR-01, FR-11 — dua peran yang diakui prototipe. */
export const peranSchema = z.enum(['operator', 'administrator']);
export type Peran = z.infer<typeof peranSchema>;

export const sesiPenggunaSchema = z.object({
  id: z.string(),
  username: z.string(),
  peran: peranSchema,
});
export type SesiPengguna = z.infer<typeof sesiPenggunaSchema>;

/**
 * FR-05 — tingkat prioritas. Definisi "sedang/tinggi/ekstrem" masih TBD
 * (BRS 3.3 R-04), jadi nilai ini adalah placeholder yang sengaja dikonfigurasi
 * di lib/priorityConfig.ts, bukan disebar di komponen.
 */
export const prioritasSchema = z.enum(['rendah', 'sedang', 'tinggi', 'ekstrem', 'tidak-diketahui']);
export type Prioritas = z.infer<typeof prioritasSchema>;

/** FR-05 — kategori indikasi. Daftar final masih TBD. */
export const kategoriIndikasiSchema = z.enum([
  'ancaman-keamanan',
  'bencana-alam',
  'medis',
  'penganiayaan',
  'perampokan',
  'tidak-terkategori',
]);
export type KategoriIndikasi = z.infer<typeof kategoriIndikasiSchema>;

/** FR-14 (Should) — status peninjauan peringatan oleh operator. */
export const statusTinjauanSchema = z.enum(['belum-ditinjau', 'perlu-ditinjau', 'ditinjau', 'selesai']);
export type StatusTinjauan = z.infer<typeof statusTinjauanSchema>;

/**
 * FR-02, FR-03 + NFR-09 — status pemrosesan satu file.
 * `gagal` wajib dibedakan dari `selesai`: sistem tidak boleh menampilkan hasil
 * seolah-olah berhasil.
 */
export const statusPemrosesanSchema = z.enum(['antre', 'memproses', 'selesai', 'gagal']);
export type StatusPemrosesan = z.infer<typeof statusPemrosesanSchema>;

/** FR-10 — koordinat peta demonstrasi. Selalu berlabel simulasi. */
export const koordinatSimulasiSchema = z.object({
  lat: z.number(),
  lng: z.number(),
  /** FR-10 + R-05: penanda bahwa ini bukan lokasi operasional nyata. */
  labelSimulasi: z.string(),
});
export type KoordinatSimulasi = z.infer<typeof koordinatSimulasiSchema>;

/**
 * Entitas inti. Satu baris = satu sampel audio yang sudah lewat
 * STT -> analisis -> dashboard (FR-03, FR-04, FR-06, FR-07).
 */
export const deteksiResultSchema = z.object({
  id: z.string(),
  /** FR-02 */
  namaFile: z.string(),
  ukuranByte: z.number().int().nonnegative(),
  durasiDetik: z.number().nonnegative().optional(),
  /** FR-06 — waktu rekaman/analisis, ISO 8601 dengan offset. */
  waktu: z.string(),
  /** FR-03, FR-06 — kutipan transkrip yang terindikasi. */
  transkrip: z.string(),
  /** FR-04 — kata kunci yang cocok dari daftar yang disepakati. */
  kataKunciTercocok: z.array(z.string()),
  /** FR-05 */
  kategori: kategoriIndikasiSchema,
  prioritas: prioritasSchema,
  /** FR-14 */
  statusTinjauan: statusTinjauanSchema,
  /** FR-03/NFR-09 */
  statusPemrosesan: statusPemrosesanSchema,
  /** FR-10 */
  koordinat: koordinatSimulasiSchema.nullable().optional(),
  /** NFR-08 — pesan error yang menjelaskan tindakan bila statusPemrosesan = gagal. */
  pesanKesalahan: z.string().nullable().optional(),
});
export type DeteksiResult = z.infer<typeof deteksiResultSchema>;

/** FR-07 — angka ringkas pada kartu statistik dashboard. */
export const ringkasanDashboardSchema = z.object({
  totalSampel: z.number().int().nonnegative(),
  indikasiTerdeteksi: z.number().int().nonnegative(),
  menungguTinjauan: z.number().int().nonnegative(),
  /** Status sistem: "SIAP" / "SIBUK" / "BERMASALAH" seperti di dashboard.png. */
  statusSistem: z.enum(['siap', 'memproses', 'bermasalah']),
});
export type RingkasanDashboard = z.infer<typeof ringkasanDashboardSchema>;

/** FR-13 — metrik evaluasi terhadap data uji berlabel. */
export const metrikEvaluasiSchema = z.object({
  precision: z.number().nullable(),
  recall: z.number().nullable(),
  falsePositive: z.number().int().nonnegative(),
  falseNegative: z.number().int().nonnegative(),
  jumlahSampelBerlabel: z.number().int().nonnegative(),
  /** FR-13: metrik boleh null kalau label/data belum memadai. */
  catatan: z.string().optional(),
});
export type MetrikEvaluasi = z.infer<typeof metrikEvaluasiSchema>;

/**
 * NFR-08 — bentuk error API. FE menampilkan `pesan` plus `tindakan`
 * supaya pengguna tahu apa yang harus dilakukan, bukan sekadar "gagal".
 */
export const kesalahanApiSchema = z.object({
  kode: z.string(),
  pesan: z.string(),
  tindakan: z.string().optional(),
});
export type KesalahanApi = z.infer<typeof kesalahanApiSchema>;

/** FR-09 (Should) — parameter pencarian/filter riwayat. Atribut final masih TBD. */
export const filterRiwayatSchema = z.object({
  q: z.string().optional(),
  kategori: kategoriIndikasiSchema.optional(),
  prioritas: prioritasSchema.optional(),
  statusTinjauan: statusTinjauanSchema.optional(),
  dari: z.string().optional(),
  sampai: z.string().optional(),
});
export type FilterRiwayat = z.infer<typeof filterRiwayatSchema>;
