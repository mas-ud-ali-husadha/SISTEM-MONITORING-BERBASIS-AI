import type { ReactNode } from 'react';
import { cx } from '../../lib/cx';

/**
 * Kotak bergaris tipis dengan nomor + judul, pola yang dipakai berulang di
 * mockup/dashboard.png ("01 Upload Audio", "02 Deteksi Terbaru").
 */
export function Panel({
  nomor,
  judul,
  keterangan,
  aksi,
  children,
  kelas,
}: {
  nomor?: string;
  judul: string;
  keterangan?: string;
  aksi?: ReactNode;
  children: ReactNode;
  kelas?: string;
}) {
  return (
    <section className={cx('border border-line-strong bg-surface', kelas)}>
      <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-3 p-4 sm:p-6">
        <div className="flex min-w-0 gap-3 sm:gap-4">
          {nomor ? (
            <span className="grid size-8 shrink-0 place-items-center border border-line-strong font-mono text-xs sm:size-9">
              {nomor}
            </span>
          ) : null}
          <div className="min-w-0">
            <h2 className="font-display text-[19px] leading-tight sm:text-[22px]">{judul}</h2>
            {keterangan ? <p className="mt-1.5 text-[13px] text-ink-muted sm:text-sm">{keterangan}</p> : null}
          </div>
        </div>
        {aksi}
      </div>
      <div className="px-4 pb-4 sm:px-6 sm:pb-6">{children}</div>
    </section>
  );
}
