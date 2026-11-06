import { useRef, useState } from 'react';
import type { DragEvent } from 'react';
import { cx } from '../../lib/cx';
import { BATAS_UKURAN_MB } from '../../lib/api';

/**
 * FR-02 — area unggah sampel WAV. Validasi format/ukuran juga ditegakkan di
 * lib/api.ts; ini hanya memberi umpan balik sebelum permintaan dikirim.
 */
export function UploadZone({
  onFile,
  sedangProses,
}: {
  onFile: (file: File) => void;
  sedangProses: boolean;
}) {
  const input = useRef<HTMLInputElement>(null);
  const [seret, setSeret] = useState(false);

  function ambilDari(list: FileList | null) {
    const f = list?.[0];
    if (f) onFile(f);
  }

  function saatSeret(e: DragEvent) {
    e.preventDefault();
    setSeret(true);
  }

  return (
    <div
      onDragOver={saatSeret}
      onDragEnter={saatSeret}
      onDragLeave={() => setSeret(false)}
      onDrop={(e) => {
        e.preventDefault();
        setSeret(false);
        ambilDari(e.dataTransfer.files);
      }}
      className={cx(
        'grid-paper border border-dashed border-line-strong px-4 py-8 text-center transition-colors sm:px-6 sm:py-12',
        seret && 'border-ink bg-surface-sunken'
      )}
    >
      <span className="mx-auto grid size-12 place-items-center border border-line-strong bg-surface">
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
          <path d="M9 14V4M5 7.5 9 3.5l4 4" stroke="currentColor" strokeWidth="1.4" />
        </svg>
      </span>

      <p className="mt-6 text-[17px] font-medium">Tarik dan lepas file WAV di sini</p>
      <p className="mt-2 text-[13px] text-ink-muted">atau klik untuk memilih file dari perangkat</p>

      <button
        type="button"
        disabled={sedangProses}
        onClick={() => input.current?.click()}
        className="mt-6 border border-line-strong bg-surface px-6 py-3 text-[13px] font-medium hover:bg-surface-sunken disabled:opacity-50"
      >
        {sedangProses ? 'Memproses…' : 'Pilih File WAV'}
      </button>
      <p className="mt-4 font-mono text-[11px] text-ink-faint">Ukuran file maksimum {BATAS_UKURAN_MB} MB</p>

      <input
        ref={input}
        type="file"
        accept=".wav,audio/wav"
        className="sr-only"
        onChange={(e) => {
          ambilDari(e.target.files);
          e.target.value = '';
        }}
      />
    </div>
  );
}
