import { useState } from 'react';
import { DetectionTable } from '../components/dashboard/DetectionTable';
import { Panel } from '../components/ui/Panel';
import { ambilRiwayat } from '../lib/api';
import { kategoriLabel, prioritasTampilan, statusTinjauanTampilan } from '../lib/displayConfig';
import { useQuery } from '@tanstack/react-query';
import type { FilterRiwayat } from '../types/detection';

/** FR-08 (Must) + FR-09 (Should) — riwayat dengan pencarian dan filter. */
export default function RiwayatPage() {
  const [filter, setFilter] = useState<FilterRiwayat>({});

  const riwayat = useQuery({
    queryKey: ['riwayat', filter],
    queryFn: () => ambilRiwayat(filter),
  });

  return (
    <Panel
      nomor="02"
      judul="Riwayat Deteksi"
      keterangan="Semua hasil analisis tersimpan dan dapat ditinjau sesuai hak akses."
    >
      <div className="mb-6 grid gap-4 md:grid-cols-4">
        <input
          value={filter.q ?? ''}
          onChange={(e) => setFilter((f) => ({ ...f, q: e.target.value }))}
          placeholder="Cari nama file atau isi transkrip"
          className="border border-line-strong bg-paper px-4 py-3 text-[14px] placeholder:text-ink-faint focus:outline-none"
        />
        <Select
          value={filter.prioritas ?? ''}
          onChange={(v) => setFilter((f) => ({ ...f, prioritas: (v || undefined) as FilterRiwayat['prioritas'] }))}
          placeholder="Semua prioritas"
          options={Object.entries(prioritasTampilan).map(([k, v]) => [k, v.label])}
        />
        <Select
          value={filter.kategori ?? ''}
          onChange={(v) => setFilter((f) => ({ ...f, kategori: (v || undefined) as FilterRiwayat['kategori'] }))}
          placeholder="Semua kategori"
          options={Object.entries(kategoriLabel)}
        />
        <Select
          value={filter.statusTinjauan ?? ''}
          onChange={(v) =>
            setFilter((f) => ({ ...f, statusTinjauan: (v || undefined) as FilterRiwayat['statusTinjauan'] }))
          }
          placeholder="Semua status"
          options={Object.entries(statusTinjauanTampilan).map(([k, v]) => [k, v.label])}
        />
      </div>

      {riwayat.isPending ? (
        <p className="py-10 text-center text-sm text-ink-muted">Memuat…</p>
      ) : riwayat.isError ? (
        <p role="alert" className="py-10 text-center text-sm text-priority-ekstrem">Gagal memuat riwayat.</p>
      ) : (
        <>
          <p className="mb-3 font-mono text-[11px] text-ink-muted">{riwayat.data.length} hasil</p>
          <DetectionTable rows={riwayat.data} />
        </>
      )}
    </Panel>
  );
}

function Select({
  value,
  onChange,
  placeholder,
  options,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  options: [string, string][];
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="border border-line-strong bg-paper px-4 py-3 text-[14px] focus:outline-none"
    >
      <option value="">{placeholder}</option>
      {options.map(([k, label]) => (
        <option key={k} value={k}>
          {label}
        </option>
      ))}
    </select>
  );
}
