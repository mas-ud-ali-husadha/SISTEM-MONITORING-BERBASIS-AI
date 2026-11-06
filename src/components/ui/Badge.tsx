import type { ReactNode } from 'react';
import { cx } from '../../lib/cx';

export function Badge({ children, kelas }: { children: ReactNode; kelas?: string }) {
  return (
    <span
      className={cx(
        'inline-flex items-center border px-2 py-1 font-mono text-[11px] tracking-[0.08em] text-ink-muted',
        kelas
      )}
    >
      {children}
    </span>
  );
}
