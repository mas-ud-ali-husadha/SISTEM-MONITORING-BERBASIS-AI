import { Link } from 'react-router';
import { Brand } from '../components/ui/Brand';

export default function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col bg-paper">
      <header className="border-b border-line-strong px-8 py-5">
        <Brand />
      </header>

      <main className="grid-paper flex flex-1 flex-col items-start justify-center px-8 py-16 md:px-16">
        <p className="eyebrow">Galat / 404</p>
        <h1 className="mt-6 font-display text-[44px] leading-none md:text-[64px]">Halaman tidak ditemukan</h1>
        <p className="mt-6 max-w-md text-[15px] leading-relaxed text-ink-muted">
          Tautan yang Anda buka tidak ada di prototipe ini. Periksa kembali alamatnya atau kembali ke dashboard.
        </p>
        <div className="mt-10 flex flex-wrap gap-4">
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-6 bg-ink px-8 py-4 text-[14px] font-medium text-paper hover:bg-ink-soft"
          >
            Ke Dashboard <span aria-hidden>→</span>
          </Link>
          <Link to="/" className="border border-line-strong bg-surface px-8 py-4 text-[14px] hover:bg-surface-sunken">
            Halaman awal
          </Link>
        </div>
      </main>

      <footer className="border-t border-line-strong bg-surface-sunken px-8 py-3">
        <span className="font-mono text-[11px] text-ink-muted">
          Prototipe akademik. Tidak terhubung ke jaringan radio operasional.
        </span>
      </footer>
    </div>
  );
}
