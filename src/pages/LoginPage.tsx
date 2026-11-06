import { useState } from 'react';
import type { FormEvent } from 'react';
import { Link, useLocation, useNavigate } from 'react-router';
import { z } from 'zod';
import { Brand } from '../components/ui/Brand';
import { Field } from '../components/ui/Field';
import { ApiError } from '../lib/api';
import { useMasuk } from '../hooks/useSesi';

// Kebijakan password final masih TBD (SRS FR-01). Untuk prototipe cukup validasi
// "tidak boleh kosong" supaya pesan error bisa menjelaskan tindakan (NFR-08).
const skemaLogin = z.object({
  username: z.string().trim().min(1, 'Masukkan username.'),
  password: z.string().min(1, 'Masukkan password.'),
});

export default function LoginPage() {
  const [nilai, setNilai] = useState({ username: '', password: '' });
  const [galat, setGalat] = useState<{ username?: string; password?: string; umum?: string }>({});
  const [tampilPassword, setTampilPassword] = useState(false);

  const masuk = useMasuk();
  const navigate = useNavigate();
  const lokasi = useLocation();
  const dari = (lokasi.state as { dari?: string } | null)?.dari ?? '/dashboard';

  async function kirim(e: FormEvent) {
    e.preventDefault();
    const hasil = skemaLogin.safeParse(nilai);
    if (!hasil.success) {
      const isi = hasil.error.issues[0];
      setGalat({ [isi.path[0] as string]: isi.message } as typeof galat);
      return;
    }

    setGalat({});
    try {
      await masuk.mutateAsync(hasil.data);
      navigate(dari, { replace: true });
    } catch (err) {
      setGalat({
        umum:
          err instanceof ApiError
            ? `${err.message}${err.tindakan ? ` — ${err.tindakan}` : ''}`
            : 'Login gagal. Pastikan backend berjalan.',
      });
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-paper">
      <header className="flex items-center justify-between border-b border-line-strong px-8 py-5">
        <Brand />
        <Link to="/" className="text-[14px] text-ink-soft hover:text-ink">
          ← Kembali
        </Link>
      </header>

      <main className="grid flex-1 place-items-center px-6 py-12">
        <div className="w-full max-w-[440px] border border-line-strong bg-surface shadow-[6px_6px_0_0_rgba(32,32,32,0.12)]">
          <div className="border-b border-line-strong px-8 py-8 text-center">
            <span className="mx-auto grid size-12 place-items-center border border-line-strong">
              <LockIcon />
            </span>
            <p className="eyebrow mt-5">Akses Sistem</p>
            <h1 className="mt-3 font-display text-[32px] leading-none">Login</h1>
            <p className="mt-4 text-[13px] text-ink-muted">Masukkan kredensial untuk mengakses dashboard monitoring.</p>
          </div>

          <form className="space-y-6 px-8 py-8" onSubmit={(e) => void kirim(e)} noValidate>
            <Field
              label="Username"
              placeholder="Masukkan username"
              autoComplete="username"
              value={nilai.username}
              onChange={(e) => setNilai((v) => ({ ...v, username: e.target.value }))}
              galat={galat.username}
            />
            <Field
              label="Password"
              type={tampilPassword ? 'text' : 'password'}
              placeholder="Masukkan password"
              autoComplete="current-password"
              value={nilai.password}
              onChange={(e) => setNilai((v) => ({ ...v, password: e.target.value }))}
              galat={galat.password}
              trailing={
                <button
                  type="button"
                  onClick={() => setTampilPassword((t) => !t)}
                  aria-label={tampilPassword ? 'Sembunyikan password' : 'Tampilkan password'}
                  className="text-ink-muted hover:text-ink"
                >
                  <EyeIcon />
                </button>
              }
            />

            {galat.umum ? (
              <p role="alert" className="border border-priority-ekstrem px-4 py-3 text-[13px] text-priority-ekstrem">
                {galat.umum}
              </p>
            ) : null}

            <button
              type="submit"
              disabled={masuk.isPending}
              className="flex w-full items-center justify-center gap-8 bg-ink px-6 py-4 text-[14px] font-medium text-paper hover:bg-ink-soft disabled:opacity-50"
            >
              {masuk.isPending ? 'Memeriksa…' : 'Masuk'} <span aria-hidden>→</span>
            </button>

            <p className="text-center font-mono text-[11px] text-ink-muted">
              Akses berdasarkan peran: Operator / Administrator
            </p>
          </form>
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

function LockIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
      <rect x="3" y="8" width="12" height="8" stroke="currentColor" strokeWidth="1.4" />
      <path d="M6 8V5.5a3 3 0 0 1 6 0V8" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  );
}

function EyeIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
      <path d="M1.5 9S4.5 4 9 4s7.5 5 7.5 5-3 5-7.5 5S1.5 9 1.5 9Z" stroke="currentColor" strokeWidth="1.4" />
      <circle cx="9" cy="9" r="2" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  );
}
