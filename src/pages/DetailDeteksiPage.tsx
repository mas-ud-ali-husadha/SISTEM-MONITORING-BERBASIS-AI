import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { ReactNode } from 'react';
import { Link, useParams } from 'react-router';
import { Panel } from '../components/ui/Panel';
import { Badge } from '../components/ui/Badge';
import { ApiError, ambilDeteksi, ubahStatusTinjauan } from '../lib/api';
import { kategoriLabel, prioritasTampilan, statusPemrosesanTampilan, statusTinjauanTampilan } from '../lib/displayConfig';
import { durasi, jamWib, ukuranFile } from '../lib/format';
import type { StatusTinjauan } from '../types/detection';

/** FR-06 — kutipan transkrip + metadata waktu. FR-14 — status peninjauan. */
export default function DetailDeteksiPage() {
  const { id = '' } = useParams();
  const qc = useQueryClient();
  const detail = useQuery({ queryKey: ['deteksi', id], queryFn: () => ambilDeteksi(id) });

  const ubah = useMutation({
    mutationFn: (statusBaru: StatusTinjauan) => ubahStatusTinjauan(id, statusBaru),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ['deteksi', id] });
      void qc.invalidateQueries({ queryKey: ['riwayat'] });
    },
  });

  if (detail.isPending) return <p className="eyebrow">Memuat detail…</p>;

  if (detail.isError) {
    const e = detail.error;
    return (
      <div className="border border-priority-ekstrem bg-surface p-6">
        <p className="text-[15px] text-priority-ekstrem">
          {e instanceof ApiError ? e.message : 'Detail tidak dapat dimuat.'}
        </p>
        {e instanceof ApiError && e.tindakan ? <p className="mt-2 text-sm text-ink-muted">{e.tindakan}</p> : null}
        <Link to="/riwayat" className="mt-4 inline-block text-sm underline">
          ← Kembali ke riwayat
        </Link>
      </div>
    );
  }

  const r = detail.data;
  const pemrosesan = statusPemrosesanTampilan[r.statusPemrosesan];

  return (
    <>
      <Panel nomor="02" judul={r.namaFile} keterangan={`${ukuranFile(r.ukuranByte)} · durasi ${durasi(r.durasiDetik)} · ${jamWib(r.waktu)}`}
        aksi={<Badge kelas={pemrosesan.badgeClass}>{pemrosesan.label}</Badge>}
      >
        {/* NFR-09: hasil gagal tidak boleh tampil seperti hasil sukses. */}
        {r.statusPemrosesan === 'gagal' ? (
          <p role="alert" className="border border-priority-ekstrem px-4 py-3 text-[13px] text-priority-ekstrem">
            {r.pesanKesalahan ?? 'Transkripsi gagal. Tidak ada hasil analisis untuk sampel ini.'}
          </p>
        ) : (
          <blockquote className="border-l-2 border-line-strong bg-paper px-6 py-5 font-display text-[19px] leading-relaxed">
            “{r.transkrip}”
          </blockquote>
        )}

        <dl className="mt-6 grid gap-x-8 gap-y-5 md:grid-cols-2">
          <Baris label="Kategori">{kategoriLabel[r.kategori]}</Baris>
          <Baris label="Prioritas">
            <Badge kelas={prioritasTampilan[r.prioritas].badgeClass}>{prioritasTampilan[r.prioritas].label}</Badge>
          </Baris>
          <Baris label="Kata kunci tercocok">
            {r.kataKunciTercocok.length ? r.kataKunciTercocok.join(', ') : 'Tidak ada'}
          </Baris>
          <Baris label="Status peninjauan">
            <Badge kelas={statusTinjauanTampilan[r.statusTinjauan].badgeClass}>
              {statusTinjauanTampilan[r.statusTinjauan].label}
            </Badge>
          </Baris>
        </dl>
      </Panel>

      <Panel judul="Aksi Peninjauan" keterangan="Tandai hasil untuk ditindaklanjuti (FR-14, status Should).">
        <div className="flex flex-wrap gap-4">
          {(['perlu-ditinjau', 'ditinjau', 'selesai'] as StatusTinjauan[]).map((s) => (
            <button
              key={s}
              type="button"
              disabled={ubah.isPending || r.statusTinjauan === s}
              onClick={() => ubah.mutate(s)}
              className="border border-line-strong bg-surface px-5 py-3 text-[13px] hover:bg-surface-sunken disabled:opacity-40"
            >
              {statusTinjauanTampilan[s].label}
            </button>
          ))}
        </div>
        {ubah.error ? <p className="mt-4 text-[13px] text-priority-ekstrem">Gagal mengubah status.</p> : null}
      </Panel>
    </>
  );
}

function Baris({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <dt className="eyebrow">{label}</dt>
      <dd className="mt-2 text-[14px]">{children}</dd>
    </div>
  );
}
