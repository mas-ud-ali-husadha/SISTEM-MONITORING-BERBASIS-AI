import { Panel } from '../components/ui/Panel';
import { Badge } from '../components/ui/Badge';
import { peranLabel } from '../lib/displayConfig';
import { sesiDummy } from '../mocks/fixtures';

/**
 * FR-11 — kelola akun dan hak akses. Hanya administrator yang sampai ke halaman
 * ini; penjagaannya ada di routes, bukan di sini.
 */
export default function KelolaAkunPage() {
  const akun = Object.values(sesiDummy);

  return (
    <Panel nomor="05" judul="Kelola Akun" keterangan="Daftar pengguna prototipe dan perannya.">
      <table className="w-full border-collapse text-left">
        <thead>
          <tr className="border-b border-line-strong">
            {['Username', 'Peran', 'Status'].map((k) => (
              <th key={k} className="eyebrow py-3 pr-4 font-normal">
                {k}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {akun.map((a) => (
            <tr key={a.id} className="border-b border-line">
              <td className="py-4 pr-4 font-mono text-[13px]">{a.username}</td>
              <td className="py-4 pr-4 text-[13px]">{peranLabel[a.peran]}</td>
              <td className="py-4">
                <Badge>aktif</Badge>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <p className="mt-6 text-[13px] text-ink-muted">
        Pembuatan akun, reset password, dan matriks izin per halaman masih TBD (SRS FR-11). CRUD di sini
        belum diimplementasikan sampai keputusan tim masuk.
      </p>
    </Panel>
  );
}
