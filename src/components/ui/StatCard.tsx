import { cx } from '../../lib/cx';

export function StatCard({
  label,
  nilai,
  keterangan,
  kelas,
}: {
  label: string;
  nilai: string;
  keterangan: string;
  kelas?: string;
}) {
  return (
    <div className={cx('border border-line-strong bg-surface p-6', kelas)}>
      <p className="eyebrow">{label}</p>
      <p className="mt-6 font-display text-[34px] leading-none tabular-nums">{nilai}</p>
      <p className="mt-6 text-[13px] text-ink-muted">{keterangan}</p>
    </div>
  );
}
