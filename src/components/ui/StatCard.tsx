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
    <div className={cx('border border-line-strong bg-surface p-4 sm:p-6', kelas)}>
      <p className="eyebrow">{label}</p>
      <p className="mt-4 font-display text-[30px] leading-none tabular-nums sm:mt-6 sm:text-[34px]">{nilai}</p>
      <p className="mt-3 text-[13px] text-ink-muted sm:mt-6">{keterangan}</p>
    </div>
  );
}
