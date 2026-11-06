import type { ReactNode } from 'react';
import { Link, Navigate, useLocation } from 'react-router';
import { useSesi } from '../../hooks/useSesi';
import { boleh, type Aksi } from '../../lib/permissions';
import { AppShell } from '../layout/AppShell';

export function RequireSession({
  eyebrow,
  judul,
  aksi,
  children,
}: {
  eyebrow: string;
  judul: string;
  aksi?: Aksi;
  children: ReactNode;
}) {
  const { data: sesi, isPending, isError } = useSesi();
  const lokasi = useLocation();

  if (isPending) {
    return (
      <div className="grid min-h-screen place-items-center bg-paper">
        <p className="eyebrow">Memeriksa sesi…</p>
      </div>
    );
  }

  // FR-01: belum masuk -> lempar ke login, simpan tujuan untuk redirect balik.
  if (isError || !sesi) {
    return <Navigate to="/login" state={{ dari: lokasi.pathname }} replace />;
  }

  // FR-11: sudah masuk tapi peran tidak berhak.
  if (aksi && !boleh(sesi.peran, aksi)) {
    return (
      <AppShell sesi={sesi} eyebrow="AKSES / DITOLAK" judul="Tidak berwenang">
        <div className="border border-line-strong bg-surface p-8">
          <p className="text-[15px]">
            Halaman ini memerlukan hak akses yang tidak dimiliki peran <strong>{sesi.peran}</strong>.
          </p>
          <p className="mt-2 text-sm text-ink-muted">
            Hubungi administrator jika Anda membutuhkan akses ini (FR-11, matriks izin masih TBD).
          </p>
          <Link to="/dashboard" className="mt-6 inline-block border border-line-strong px-4 py-2 text-sm hover:bg-surface-sunken">
            ← Kembali ke dashboard
          </Link>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell sesi={sesi} eyebrow={eyebrow} judul={judul}>
      {children}
    </AppShell>
  );
}
