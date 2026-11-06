import { cx } from '../../lib/cx';

export function Brand({ kelas }: { kelas?: string }) {
  return (
    <div className={cx('flex items-center gap-3', kelas)}>
      <span className="grid size-11 place-items-center border border-line-strong bg-surface font-mono text-sm font-bold">
        AI
      </span>
      <span className="leading-tight">
        <span className="block font-mono text-[15px] font-bold tracking-[0.14em]">MONITOR HT</span>
        <span className="eyebrow mt-1 block text-[10px] text-ink-muted">Prototipe Akademik</span>
      </span>
    </div>
  );
}
