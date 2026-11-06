import 'leaflet/dist/leaflet.css';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
import { divIcon } from 'leaflet';
import type { MarkerProps } from 'react-leaflet';
import { useQuery } from '@tanstack/react-query';
import { ambilRiwayat } from '../lib/api';
import { Panel } from '../components/ui/Panel';
import { Badge } from '../components/ui/Badge';
import { prioritasTampilan } from '../lib/displayConfig';
import type { DeteksiResult, KoordinatSimulasi } from '../types/detection';

/**
 * FR-10 — peta demonstrasi. Koordinatnya SIMULASI dan label itu harus selalu
 * terlihat (BRS 3.3 R-05: jangan sampai disalahartikan sebagai lokasi nyata).
 */
export default function PetaPage() {
  const riwayat = useQuery({ queryKey: ['riwayat', { peta: true }], queryFn: () => ambilRiwayat({}) });

  const bertitik = (riwayat.data ?? []).filter(punyaKoordinat);
  const awal = bertitik[0]?.koordinat ?? { lat: -6.914, lng: 107.646, labelSimulasi: '' };

  return (
    <Panel
      nomor="03"
      judul="Peta Simulasi"
      keterangan="Sebaran indikasi dalam skenario simulasi akademik."
      aksi={<Badge kelas="border-ink uppercase">data simulasi</Badge>}
    >
      <div className="h-[520px] w-full overflow-hidden border border-line-strong">
        <MapContainer center={[awal.lat, awal.lng]} zoom={13} className="h-full w-full" scrollWheelZoom={false}>
          <TileLayer attribution="&copy; OpenStreetMap contributors" url="https://tile.openstreetmap.org/{z}/{x}/{y}.png" />
          {bertitik.map((r) => (
            <TitikIndikasi key={r.id} row={r} />
          ))}
        </MapContainer>
      </div>

      <p className="mt-4 text-[13px] text-ink-muted">
        {bertitik.length} titik ditampilkan. Seluruh koordinat adalah data uji, bukan lokasi operasional
        sebenarnya.
      </p>
    </Panel>
  );
}

function punyaKoordinat(r: DeteksiResult): r is DeteksiResult & { koordinat: KoordinatSimulasi } {
  return Boolean(r.koordinat);
}

function TitikIndikasi({ row }: { row: DeteksiResult & { koordinat: KoordinatSimulasi } }) {
  const t = prioritasTampilan[row.prioritas];

  const markerProps: MarkerProps = {
    position: [row.koordinat.lat, row.koordinat.lng],
    icon: divIcon({
      className: '',
      html: `<span style="display:block;width:14px;height:14px;border:2px solid var(--color-ink);background:${t.warna}"></span>`,
      iconSize: [14, 14],
    }),
  };

  return (
    <Marker {...markerProps}>
      <Popup>
        <p className="font-mono text-[12px]">{row.namaFile}</p>
        <p className="mt-1 text-[13px]">{row.transkrip}</p>
        <p className="mt-2 font-mono text-[10px] uppercase tracking-widest">
          {t.label} · {row.koordinat.labelSimulasi}
        </p>
      </Popup>
    </Marker>
  );
}
