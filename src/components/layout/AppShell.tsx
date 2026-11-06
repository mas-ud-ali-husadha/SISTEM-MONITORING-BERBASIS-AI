import { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router';
import type { ReactNode } from 'react';
import { cx } from '../../lib/cx';
import { peranLabel } from '../../lib/displayConfig';
import { MENU_UTAMA } from '../../lib/nav';
import { boleh } from '../../lib/permissions';
import { useKeluar } from '../../hooks/useSesi';
import type { SesiPengguna } from '../../types/detection';
import { Badge } from '../ui/Badge';
import { Brand } from '../ui/Brand';

function inisial(nama: string): string {
  return nama.slice(0, 2).toUpperCase();
}

export function AppShell({
  sesi,
  eyebrow,
  judul,
  children,
}: {
  sesi: SesiPengguna;
  eyebrow: string;
  judul: string;
  children: ReactNode;
}) {
  const navigate = useNavigate();
  const keluar = useKeluar();
  const [drawerBuka, setDrawerBuka] = useState(false);

  // Drawer terbuka = latar terkunci, Escape menutup.
  useEffect(() => {
    if (!drawerBuka) return;
    const saatKeydown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setDrawerBuka(false);
    };
    document.addEventListener('keydown', saatKeydown);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', saatKeydown);
      document.body.style.overflow = '';
    };
  }, [drawerBuka]);

  return (
    <div className="flex min-h-screen bg-paper">
      {drawerBuka ? (
        <button
          type="button"
          aria-label="Tutup menu"
          onClick={() => setDrawerBuka(false)}
          className="fixed inset-0 z-30 cursor-default bg-ink/40 lg:hidden"
        />
      ) : null}

      <aside
        className={cx(
          'fixed inset-y-0 left-0 z-40 flex w-[264px] max-w-[85vw] shrink-0 flex-col border-r border-line-strong bg-sidebar transition-transform duration-200',
          'lg:static lg:w-[236px] lg:max-w-none lg:translate-x-0 lg:transition-none',
          drawerBuka ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex h-[var(--tinggi-kepala)] shrink-0 items-center justify-between gap-3 border-b border-line-strong px-5">
          <Brand />
          <button
            type="button"
            onClick={() => setDrawerBuka(false)}
            aria-label="Tutup menu"
            className="grid size-9 shrink-0 place-items-center border border-line-strong hover:bg-surface lg:hidden"
          >
            <span aria-hidden>✕</span>
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-5 py-6">
          <p className="eyebrow mb-5">Menu Utama</p>
          <ul className="space-y-1">
            {MENU_UTAMA.map((item) => {
              // FR-11: menu yang tidak boleh dibuka perannya tetap tampil,
              // tapi ditandai "admin only" supaya hak aksesnya jelas.
              if (item.aksi && !boleh(sesi.peran, item.aksi)) {
                return (
                  <li key={item.ke}>
                    <div className="flex items-center gap-3 px-3 py-3 text-ink-faint" title="Hanya untuk administrator">
                      <span className="font-mono text-[11px]">{item.nomor}</span>
                      <span className="flex-1 text-[14px]">{item.label}</span>
                      <Badge kelas="border-line text-[9px]">admin only</Badge>
                    </div>
                  </li>
                );
              }
              return (
                <li key={item.ke}>
                  <NavLink
                    to={item.ke}
                    // Di layar kecil drawer menutup setelah item dipilih.
                    onClick={() => setDrawerBuka(false)}
                    className={({ isActive }) =>
                      cx(
                        'flex items-center gap-3 border px-3 py-3 text-[14px] transition-colors',
                        isActive
                          ? 'border-line-strong bg-surface font-medium text-ink'
                          : 'border-transparent text-ink-soft hover:border-line hover:bg-surface/60'
                      )
                    }
                  >
                    <span className="font-mono text-[11px] text-ink-muted">{item.nomor}</span>
                    <span>{item.label}</span>
                  </NavLink>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="space-y-4 p-5">
          <div className="flex items-center gap-2 border border-dashed border-line-strong px-3 py-3">
            <span className="size-1.5 rounded-full bg-ink" aria-hidden />
            <span className="font-mono text-[11px] text-ink-muted">Sistem simulasi aktif</span>
          </div>
          <button
            type="button"
            onClick={() => {
              void keluar.mutateAsync().then(() => navigate('/login'));
            }}
            className="flex w-full items-center gap-2 border-t border-line-strong pt-4 text-left text-[14px] hover:text-ink"
          >
            <span aria-hidden>←</span> Logout
          </button>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-[var(--tinggi-kepala)] shrink-0 items-center gap-3 border-b border-line-strong px-4 sm:gap-6 sm:px-8">
          <button
            type="button"
            onClick={() => setDrawerBuka(true)}
            aria-label="Buka menu"
            className="grid size-10 shrink-0 place-items-center border border-line-strong bg-surface hover:bg-surface-sunken lg:hidden"
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
              <path d="M2 5h14M2 9h14M2 13h14" stroke="currentColor" strokeWidth="1.4" />
            </svg>
          </button>

          <div className="min-w-0 flex-1">
            <p className="eyebrow truncate">{eyebrow}</p>
            <h1 className="mt-1.5 truncate font-display text-[22px] leading-none sm:mt-2 sm:text-[30px]">{judul}</h1>
          </div>

          <div className="flex shrink-0 items-center gap-2 sm:gap-3">
            <span className="grid size-9 place-items-center border border-line-strong bg-surface font-mono text-xs sm:size-10">
              {inisial(sesi.username)}
            </span>
            <span className="hidden leading-tight md:block">
              <span className="block text-[14px] font-medium">{peranLabel[sesi.peran]}</span>
              <span className="block font-mono text-[12px] text-ink-muted">{sesi.username}@monitor.ht</span>
            </span>
            <Badge kelas="hidden uppercase sm:inline-flex">{sesi.peran}</Badge>
          </div>
        </header>

        <main className="flex-1 space-y-5 p-4 sm:space-y-6 sm:p-6 lg:p-8">{children}</main>

        <footer className="border-t border-line-strong bg-surface-sunken px-4 py-3 sm:px-8">
          <span className="font-mono text-[10px] leading-relaxed text-ink-muted sm:text-[11px]">
            Prototipe akademik. Tidak terhubung ke jaringan radio operasional.
          </span>
        </footer>
      </div>
    </div>
  );
}
