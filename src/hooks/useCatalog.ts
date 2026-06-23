import { useQuery } from '@tanstack/react-query';
import { Catalog } from '../types';

async function fetchCatalog(): Promise<Catalog> {
  // Served by the bonus Express API (see server/index.js), proxied by Vite.
  const res = await fetch('/api/catalog');
  if (!res.ok) {
    throw new Error(`Failed to load catalog (${res.status})`);
  }
  return res.json();
}

export function useCatalog() {
  return useQuery({
    queryKey: ['catalog'],
    queryFn: fetchCatalog,
    staleTime: Infinity,
  });
}
