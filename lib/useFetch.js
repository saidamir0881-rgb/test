'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import { api } from './api';

export function useFetch(path, query, { enabled = true } = {}) {
  const [state, setState] = useState({ data: null, pagination: null, extra: null, loading: enabled, error: null });
  const [tick, setTick] = useState(0);
  const key = JSON.stringify([path, query, enabled, tick]);
  const latest = useRef(0);

  useEffect(() => {
    if (!enabled || !path) { setState((s) => ({ ...s, loading: false })); return undefined; }
    const id = ++latest.current;
    setState((s) => ({ ...s, loading: true, error: null }));
    api(path, { query })
      .then((r) => { if (id === latest.current) setState({ data: r.data, pagination: r.pagination || null, extra: r, loading: false, error: null }); })
      .catch((e) => { if (id === latest.current) setState({ data: null, pagination: null, extra: null, loading: false, error: e.message }); });
    return () => { latest.current += 1; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  const reload = useCallback(() => setTick((t) => t + 1), []);
  return { ...state, reload };
}
