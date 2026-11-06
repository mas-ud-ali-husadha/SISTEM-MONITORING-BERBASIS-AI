import { lazy, Suspense } from 'react';
import type { ReactNode } from 'react';
import type { RouteObject } from 'react-router';
import { createBrowserRouter, Navigate } from 'react-router';
import { RequireSession } from '../components/guards/RequireSession';
import { AKSI, type Aksi } from '../lib/permissions';
import DashboardPage from '../pages/DashboardPage';
import DetailDeteksiPage from '../pages/DetailDeteksiPage';
import EksporPage from '../pages/EksporPage';
import KelolaAkunPage from '../pages/KelolaAkunPage';
import LandingPage from '../pages/LandingPage';
import LoginPage from '../pages/LoginPage';
import NotFoundPage from '../pages/NotFoundPage';
import RiwayatPage from '../pages/RiwayatPage';

// Leaflet ±180 kB: dipecah supaya tidak ikut memuat di dashboard dan riwayat.
const PetaPage = lazy(() => import('../pages/PetaPage'));

/**
 * Semua halaman aplikasi dibungkus RequireSession: belum login dilempar ke
 * /login (FR-01), sudah login tapi perannya tidak berhak mendapat layar
 * "Tidak berwenang" (FR-11). `aksi` diisi sama dengan yang dibaca sidebar.
 */
function dilindungi(
  path: string,
  opsi: { eyebrow: string; judul: string; aksi?: Aksi; element: ReactNode }
): RouteObject {
  return {
    path,
    element: (
      <RequireSession eyebrow={opsi.eyebrow} judul={opsi.judul} aksi={opsi.aksi}>
        <Suspense fallback={<p className="eyebrow">Memuat bagian…</p>}>{opsi.element}</Suspense>
      </RequireSession>
    ),
  };
}

export const router = createBrowserRouter([
  { path: '/', element: <LandingPage /> },
  { path: '/login', element: <LoginPage /> },

  // FR-02, FR-03, FR-07
  dilindungi('/dashboard', {
    eyebrow: 'MONITOR / 01',
    judul: 'Dashboard',
    aksi: AKSI.lihatDashboard,
    element: <DashboardPage />,
  }),

  // FR-08, FR-09
  dilindungi('/riwayat', {
    eyebrow: 'MONITOR / 02',
    judul: 'Riwayat Deteksi',
    aksi: AKSI.lihatRiwayat,
    element: <RiwayatPage />,
  }),

  // FR-06, FR-14
  dilindungi('/riwayat/:id', {
    eyebrow: 'MONITOR / 02',
    judul: 'Detail Deteksi',
    aksi: AKSI.lihatRiwayat,
    element: <DetailDeteksiPage />,
  }),

  // FR-10
  dilindungi('/peta', {
    eyebrow: 'MONITOR / 03',
    judul: 'Peta Simulasi',
    aksi: AKSI.lihatPeta,
    element: <PetaPage />,
  }),

  // FR-12
  dilindungi('/ekspor', {
    eyebrow: 'MONITOR / 04',
    judul: 'Ekspor CSV',
    aksi: AKSI.eksporCsv,
    element: <EksporPage />,
  }),

  // FR-11
  dilindungi('/akun', {
    eyebrow: 'MONITOR / 05',
    judul: 'Kelola Akun',
    aksi: AKSI.kelolaAkun,
    element: <KelolaAkunPage />,
  }),

  { path: '/home', element: <Navigate to="/dashboard" replace /> },
  { path: '*', element: <NotFoundPage /> },
]);
