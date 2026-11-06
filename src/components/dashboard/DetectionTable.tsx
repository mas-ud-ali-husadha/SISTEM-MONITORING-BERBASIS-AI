import { Link } from 'react-router';
import { kategoriLabel, prioritasTampilan, statusTinjauanTampilan } from '../../lib/displayConfig';
import { jamWib } from '../../lib/format';
import type { DeteksiResult } from '../../types/detection';
import { Badge } from '../ui/Badge';

const KEPALA = ['Nama file', 'Waktu', 'Indikasi', 'Prioritas', 'Status'];

/**
 * FR-06, FR-07. Kolom "Prioritas" sengaja ditambahkan di atas mockup karena
 * FR-05 mewajibkan tingkat prioritas tampil, dan mockup dashboard.png belum
 * memuatnya.
 */
export function DetectionTable({ rows }: { rows: DeteksiResult[] }) {
  if (rows.length === 0) {
    return <p className="py-10 text-center text-sm text-ink-muted">Belum ada hasil deteksi.</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-left">
        <thead>
          <tr className="border-b border-line-strong">
            {KEPALA.map((k) => (
              <th key={k} className="eyebrow py-3 pr-4 font-normal">
                {k}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.id} className="border-b border-line hover:bg-surface-sunken">
              <td className="py-4 pr-4 font-mono text-[13px]">
                <Link to={`/riwayat/${r.id}`} className="underline decoration-line underline-offset-4 hover:decoration-ink">
                  {r.namaFile}
                </Link>
              </td>
              <td className="py-4 pr-4 text-[13px]">{jamWib(r.waktu)}</td>
              <td className="py-4 pr-4 text-[13px]">
                {r.kataKunciTercocok.length > 0 ? `${r.kataKunciTercocok.length} kata kunci` : 'Tidak ada'}
                <span className="ml-2 text-ink-faint">· {kategoriLabel[r.kategori]}</span>
              </td>
              <td className="py-4 pr-4">
                <Badge kelas={prioritasTampilan[r.prioritas].badgeClass}>{prioritasTampilan[r.prioritas].label}</Badge>
              </td>
              <td className="py-4">
                <Badge kelas={statusTinjauanTampilan[r.statusTinjauan].badgeClass}>
                  {statusTinjauanTampilan[r.statusTinjauan].label}
                </Badge>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
