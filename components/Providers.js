'use client';
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { AuthProvider } from '@/lib/auth';
import { CheckCircle2, Info, XCircle } from 'lucide-react';

const ThemeCtx = createContext({ theme: 'dark', toggle() {} });
export const useTheme = () => useContext(ThemeCtx);
const ToastCtx = createContext(null);
export const useToast = () => useContext(ToastCtx);

function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('dark');
  useEffect(() => { setTheme(document.documentElement.classList.contains('dark') ? 'dark' : 'light'); }, []);
  const toggle = useCallback(() => {
    const next = document.documentElement.classList.contains('dark') ? 'light' : 'dark';
    document.documentElement.classList.toggle('dark', next === 'dark');
    try { localStorage.setItem('ts_theme', next); } catch { /* ignore */ }
    setTheme(next);
  }, []);
  return <ThemeCtx.Provider value={{ theme, toggle }}>{children}</ThemeCtx.Provider>;
}

function ToastProvider({ children }) {
  const [items, setItems] = useState([]);
  const push = useCallback((type, message) => {
    const id = Date.now() + Math.random();
    setItems((i) => [...i, { id, type, message }]);
    setTimeout(() => setItems((i) => i.filter((x) => x.id !== id)), 4500);
  }, []);
  const api = useMemo(() => ({ success: (m) => push('success', m), error: (m) => push('error', m), info: (m) => push('info', m) }), [push]);
  const icons = { success: <CheckCircle2 className="h-5 w-5 text-accent" />, error: <XCircle className="h-5 w-5 text-red-500" />, info: <Info className="h-5 w-5 text-brand" /> };
  return (
    <ToastCtx.Provider value={api}>
      {children}
      <div aria-live="polite" className="fixed bottom-4 right-4 z-[100] flex w-[calc(100%-2rem)] max-w-sm flex-col gap-2">
        {items.map((t) => (
          <div key={t.id} role="status" className="flex items-start gap-3 rounded-xl border border-line bg-surface p-3 text-sm shadow-xl">
            {icons[t.type]}<span className="flex-1">{t.message}</span>
          </div>
        ))}
      </div>
    </ToastCtx.Provider>
  );
}

export default function Providers({ children }) {
  return <ThemeProvider><ToastProvider><AuthProvider>{children}</AuthProvider></ToastProvider></ThemeProvider>;
}
