import type { InputHTMLAttributes, ReactNode } from 'react';

export function Field({
  label,
  trailing,
  galat,
  ...inputProps
}: InputHTMLAttributes<HTMLInputElement> & { label: string; trailing?: ReactNode; galat?: string }) {
  return (
    <label className="block">
      <span className="block font-mono text-[13px] font-bold">{label}</span>
      <span className="relative mt-2 block">
        <input
          {...inputProps}
          aria-invalid={galat ? true : undefined}
          className="w-full border border-line-strong bg-paper px-4 py-3 text-[15px] text-ink placeholder:text-ink-faint focus:border-ink focus:outline-none"
        />
        {trailing ? <span className="absolute inset-y-0 right-3 flex items-center">{trailing}</span> : null}
      </span>
      {/* NFR-08: pesan salah harus menyebut tindakan, bukan cuma "tidak valid". */}
      {galat ? <span className="mt-2 block text-[13px] text-priority-ekstrem">{galat}</span> : null}
    </label>
  );
}
