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

  return (
    <div className="flex min-h-screen bg-paper">
      <aside className="flex w-[236px] shrink-0 flex-col border-r border-line-strong bg-sidebar">
        <div className="border-b border-line-strong p-5">
          <Brand />
        </div>

        <nav className="flex-1 px-5 py-6">
          <p className="eyebrow mb-5">Menu Utama</p>
          <ul className="space-y-1">
            {MENU_UTAMA.map((item) => {
              const bolehAkses = !item.aksi || boleh(sesi.peran, item.aksi);
              if (!bolehAkses) {
                return (
                  <li key={item.ke}>
                    <div
                      className="flex items-center gap-3 px-3 py-3 text-ink-faint"
                      title="Hanya untuk administrator"
                    >
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
        <header className="flex items-center justify-between gap-6 border-b border-line-strong px-8 py-5">
          <div>
            <p className="eyebrow">{eyebrow}</p>
            <h1 className="mt-2 font-display text-[30px] leading-none">{judul}</h1>
          </div>
          <div className="flex items-center gap-3">
            <span className="grid size-10 place-items-center border border-line-strong bg-surface font-mono text-xs">
              {inisial(sesi.username)}
            </span>
            <span className="leading-tight">
              <span className="block text-[14px] font-medium">{peranLabel[sesi.peran]}</span>
              <span className="block font-mono text-[12px] text-ink-muted">{sesi.username}@monitor.ht</span>
            </span>
            <Badge kelas="ml-1 uppercase">{sesi.peran}</Badge>
          </div>
        </header>

        <main className="flex-1 space-y-8 overflow-auto p-8">{children}</main>

        <footer className="border-t border-line-strong bg-surface-sunken px-8 py-3">
          <span className="font-mono text-[11px] text-ink-muted">
            Prototipe akademik. Tidak terhubung ke jaringan radio operasional.
          </span>
        </footer>
      </div>
    </div>
  );
}
