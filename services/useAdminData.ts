'use client';
import { useCallback, useEffect, useState } from 'react';
import { callAdmin, friendlyError } from './adminApi';

export function useAdminData<T = any>(action: string, params: Record<string, unknown> = {}) {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const key = JSON.stringify(params);
  const load = useCallback(async () => {
    setLoading(true); setError(null);
    try { setData(await callAdmin<T>(action, JSON.parse(key))); } catch (e) { setError(friendlyError(e)); } finally { setLoading(false); }
  }, [action, key]);
  useEffect(() => { load(); }, [load]);
  return { data, error, loading, reload: load };
}
