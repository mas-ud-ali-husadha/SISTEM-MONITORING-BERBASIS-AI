/**
 * Format waktu untuk tabel, mengikuti gaya "10:42 WIB" di mockup/dashboard.png.
 * Jam dibaca langsung dari offset ISO (bukan zona waktu browser) supaya operator
 * dan dosen melihat angka yang sama dengan backend.
 */
export function jamWib(iso: string): string {
  const cocok = /T(\d{2}:\d{2})/.exec(iso);
  return cocok ? `${cocok[1]} WIB` : '—';
}

export function tanggalWib(iso: string): string {
  const cocok = /^(\d{4})-(\d{2})-(\d{2})/.exec(iso);
  if (!cocok) return '—';
  const [, y, m, d] = cocok;
  const bulan = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'][
    Number(m) - 1
  ];
  return `${d} ${bulan} ${y}`;
}

export function ukuranFile(byte: number): string {
  return `${(byte / 1024 / 1024).toFixed(1)} MB`;
}

export function durasi(detik?: number): string {
  if (detik === undefined) return '—';
  const m = Math.floor(detik / 60);
  const s = Math.round(detik % 60);
  return `${m}:${String(s).padStart(2, '0')}`;
}
