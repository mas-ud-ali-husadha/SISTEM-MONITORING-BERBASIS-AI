import { useMutation } from '@tanstack/react-query';
import { Panel } from '../components/ui/Panel';
import { ApiError, eksporCsv } from '../lib/api';

/** FR-12 + NFR-04 — ekspor hanya lewat backend supaya aksinya tercatat di audit log. */
export default function EksporPage() {
  const ekspor = useMutation({ mutationFn: eksporCsv });

  const galat = ekspor.error instanceof ApiError ? `${ekspor.error.message} ${ekspor.error.tindakan ?? ''}` : null;

  return (
    <Panel
      nomor="04"
      judul="Ekspor CSV"
      keterangan="Unduh riwayat deteksi dalam format CSV untuk keperluan evaluasi (FR-13)."
    >
      <div className="flex flex-wrap items-center gap-6 border border-line-strong bg-paper p-6">
        <button
          type="button"
          disabled={ekspor.isPending}
          onClick={() => ekspor.mutate()}
          className="flex items-center gap-6 bg-ink px-8 py-4 text-[14px] font-medium text-paper hover:bg-ink-soft disabled:opacity-50"
        >
          {ekspor.isPending ? 'Menyiapkan…' : 'Ekspor CSV'} <span aria-hidden>↓</span>
        </button>

        {ekspor.isSuccess ? (
          <p className="text-[13px] text-ink-muted">Berkas diunduh. Aksi ekspor tercatat pada log (NFR-04).</p>
        ) : null}
      </div>

      {galat ? (
        <p role="alert" className="mt-4 border border-priority-ekstrem px-4 py-3 text-[13px] text-priority-ekstrem">
          {galat}
        </p>
      ) : null}

      <p className="mt-4 text-[13px] text-ink-muted">
        Cakupan kolom dan retensi hasil ekspor masih TBD (SRS FR-12, BRS 3.2 butir 4).
      </p>
    </Panel>
  );
}
