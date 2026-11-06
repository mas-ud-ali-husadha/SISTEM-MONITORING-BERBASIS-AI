import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router';
import { DetectionTable } from '../components/dashboard/DetectionTable';
import { UploadZone } from '../components/dashboard/UploadZone';
import { Panel } from '../components/ui/Panel';
import { StatCard } from '../components/ui/StatCard';
import { ApiError, ambilRingkasan, ambilRiwayat, unggahAudio } from '../lib/api';
import { Badge } from '../components/ui/Badge';

const STATUS_SISTEM = {
  siap: 'SIAP',
  memproses: 'SIBUK',
  bermasalah: 'BERMASALAH',
} as const;

export default function DashboardPage() {
  const qc = useQueryClient();
  const ringkasan = useQuery({ queryKey: ['ringkasan'], queryFn: ambilRingkasan });
  const riwayat = useQuery({ queryKey: ['riwayat', {}], queryFn: () => ambilRiwayat({}) });

  const unggah = useMutation({
    mutationFn: unggahAudio,
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ['riwayat'] });
      void qc.invalidateQueries({ queryKey: ['ringkasan'] });
    },
  });

  const galatUnggah = unggah.error
    ? unggah.error instanceof ApiError
      ? `${unggah.error.message}${unggah.error.tindakan ? ` — ${unggah.error.tindakan}` : ''}`
      : 'Pengunggahan gagal.'
    : null;

  return (
    <>
      <Panel nomor="01" judul="Upload Audio" keterangan="Unggah sampel rekaman untuk memulai transkripsi dan analisis." aksi={<Badge>format: wav</Badge>}>
        <UploadZone onFile={(f) => unggah.mutate(f)} sedangProses={unggah.isPending} />
        {galatUnggah ? (
          <p role="alert" className="mt-4 border border-priority-ekstrem px-4 py-3 text-[13px] text-priority-ekstrem">
            {galatUnggah}
          </p>
        ) : null}
      </Panel>

      <div className="grid gap-4 sm:grid-cols-3 lg:gap-6">
        <StatCard
          label="Total Sampel"
          nilai={String(ringkasan.data?.totalSampel ?? '—')}
          keterangan="Audio telah dianalisis"
        />
        <StatCard
          label="Indikasi Terdeteksi"
          nilai={String(ringkasan.data?.indikasiTerdeteksi ?? '—')}
          keterangan="Memerlukan peninjauan"
        />
        <StatCard
          label="Status Sistem"
          nilai={ringkasan.data ? STATUS_SISTEM[ringkasan.data.statusSistem] : '—'}
          keterangan={ringkasan.isPending ? 'Menghubungi backend…' : 'Menunggu file audio'}
          kelas={ringkasan.isError ? 'border-priority-ekstrem' : undefined}
        />
      </div>

      <Panel
        nomor="02"
        judul="Deteksi Terbaru"
        keterangan="Ringkasan hasil analisis sampel audio terakhir."
        aksi={
          <Link to="/riwayat" className="text-[13px] underline decoration-line underline-offset-4 hover:decoration-ink">
            Lihat semua →
          </Link>
        }
      >
        {riwayat.isPending ? (
          <p className="py-10 text-center text-sm text-ink-muted">Memuat hasil deteksi…</p>
        ) : riwayat.isError ? (
          <p role="alert" className="py-10 text-center text-sm text-priority-ekstrem">
            Gagal memuat riwayat. Pastikan backend berjalan atau biarkan mode fixture aktif.
          </p>
        ) : (
          <DetectionTable rows={riwayat.data.slice(0, 5)} />
        )}
      </Panel>
    </>
  );
}
