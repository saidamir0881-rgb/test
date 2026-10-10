'use client';
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { api, getToken, setToken } from './api';

const Ctx = createContext(null);
export const useAuth = () => useContext(Ctx);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [saved, setSaved] = useState([]); // ["Tryout:id", ...]
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!getToken()) { setUser(null); setProfile(null); setSaved([]); setLoading(false); return; }
    try {
      const r = await api('/auth/me');
      setUser(r.data.user);
      setProfile(r.data.profile);
      const s = await api('/users/saved');
      setSaved(s.data.map((x) => `${x.targetModel}:${x.item._id}`));
    } catch {
      setToken(null); setUser(null); setProfile(null); setSaved([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
    const onLogout = () => { setUser(null); setProfile(null); setSaved([]); };
    window.addEventListener('ts-logout', onLogout);
    return () => window.removeEventListener('ts-logout', onLogout);
  }, [load]);

  const value = useMemo(() => ({
    user, profile, loading, reload: load,
    isSaved: (model, id) => saved.includes(`${model}:${id}`),
    async toggleSaved(targetType, id) {
      const r = await api('/users/saved', { method: 'POST', body: { targetType, targetId: id } });
      const model = { tryout: 'Tryout', scholarship: 'Scholarship', club: 'Club' }[targetType];
      setSaved((s) => (r.saved ? [...s, `${model}:${id}`] : s.filter((k) => k !== `${model}:${id}`)));
      return r;
    },
    async login(email, password) {
      const r = await api('/auth/login', { method: 'POST', body: { email, password } });
      setToken(r.data.token); await load(); return r;
    },
    async register(body) {
      const r = await api('/auth/register', { method: 'POST', body });
      setToken(r.data.token); await load(); return r;
    },
    logout() { setToken(null); setUser(null); setProfile(null); setSaved([]); },
  }), [user, profile, loading, saved, load]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
