import { Link } from 'react-router';
import { Brand } from '../components/ui/Brand';

const FITUR = [
  {
    nomor: '01',
    judul: 'Transkripsi Whisper',
    isi: 'Mengubah sampel audio WAV menjadi teks percakapan yang dapat ditinjau.',
  },
  {
    nomor: '02',
    judul: 'Analisis Kata Kunci',
    isi: 'Menandai indikasi kata kunci untuk membantu proses peninjauan operator.',
  },
  {
    nomor: '03',
    judul: 'Dashboard & Peta Simulasi',
    isi: 'Merangkum hasil deteksi dan menampilkan lokasi dalam skenario simulasi.',
  },
];

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-paper">
      <header className="flex items-center justify-between border-b border-line-strong px-8 py-5">
        <Brand />
        <Link
          to="/login"
          className="border border-line-strong bg-surface px-6 py-3 text-[14px] hover:bg-surface-sunken"
        >
          Login
        </Link>
      </header>

      <section className="px-8 py-16 md:px-16 lg:py-24">
        <p className="eyebrow">Prototipe Sistem Monitoring</p>
        <h1 className="mt-6 max-w-4xl font-display text-[44px] leading-[1.08] md:text-[64px]">
          Sistem Monitoring Percakapan Radio HT Berbantuan AI
        </h1>
        <p className="mt-8 max-w-xl text-[15px] leading-relaxed text-ink-muted">
          Membantu meninjau indikasi komunikasi dari sampel audio WAV. Dirancang untuk mendukung
          analisis dalam lingkungan simulasi akademik.
        </p>
        <Link
          to="/login"
          className="mt-10 inline-flex items-center gap-8 bg-ink px-8 py-4 text-[14px] font-medium text-paper hover:bg-ink-soft"
        >
          Login <span aria-hidden>→</span>
        </Link>
      </section>

      <section className="grid-paper mt-auto border-t border-line-strong px-8 py-14 md:px-16">
        <div className="grid gap-6 md:grid-cols-3">
          {FITUR.map((f) => (
            <article key={f.nomor} className="border border-line-strong bg-surface p-6">
              <p className="font-mono text-[11px] text-ink-muted">{f.nomor}</p>
              <span className="mt-6 grid size-12 place-items-center border border-line-strong">
                <BarChartIcon />
              </span>
              <h2 className="mt-8 text-[17px] font-medium">{f.judul}</h2>
              <p className="mt-3 text-[14px] leading-relaxed text-ink-muted">{f.isi}</p>
            </article>
          ))}
        </div>
      </section>

      <footer className="border-t border-line-strong bg-surface-sunken px-8 py-3">
        <span className="font-mono text-[11px] text-ink-muted">
          Prototipe akademik. Tidak terhubung ke jaringan radio operasional.
        </span>
      </footer>
    </div>
  );
}

function BarChartIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
      <path d="M4 16V9M10 16V4M16 16V11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" />
    </svg>
  );
}
