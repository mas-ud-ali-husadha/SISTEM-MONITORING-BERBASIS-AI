import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ambilSesi, keluar, masuk } from '../lib/api';

/** FR-01 — sesi dibaca dari backend, tidak pernah disimpan di localStorage. */
export function useSesi() {
  return useQuery({
    queryKey: ['sesi'],
    queryFn: ambilSesi,
    staleTime: Number.POSITIVE_INFINITY,
    retry: false,
  });
}

export function useMasuk() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ username, password }: { username: string; password: string }) => masuk(username, password),
    onSuccess: (sesi) => {
      qc.setQueryData(['sesi'], sesi);
    },
  });
}

export function useKeluar() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: keluar,
    onSuccess: () => qc.setQueryData(['sesi'], null),
  });
}
