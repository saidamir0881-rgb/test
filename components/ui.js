'use client';
import { useEffect } from 'react';
import { AlertTriangle, ChevronLeft, ChevronRight, Inbox, Loader2, X } from 'lucide-react';

export const Spinner = ({ className = 'h-5 w-5' }) => <Loader2 className={`animate-spin ${className}`} aria-label="Yuklanmoqda" />;

export const Skeleton = ({ className = '' }) => <div className={`skeleton rounded-xl ${className}`} />;

export function CardSkeletons({ count = 6, className = 'h-64' }) {
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => <Skeleton key={i} className={className} />)}
    </div>
  );
}

export function EmptyState({ title = "Hozircha ma'lumot yo'q", text, action }) {
  return (
    <div className="card flex flex-col items-center gap-3 px-6 py-14 text-center">
      <div className="rounded-2xl bg-brand/10 p-4 text-brand"><Inbox className="h-8 w-8" /></div>
      <h3 className="font-display text-lg font-semibold">{title}</h3>
      {text && <p className="max-w-md text-sm text-muted">{text}</p>}
      {action}
    </div>
  );
}

export function ErrorState({ message, onRetry }) {
  return (
    <div className="card flex flex-col items-center gap-3 border-red-500/40 px-6 py-12 text-center">
      <AlertTriangle className="h-8 w-8 text-red-500" />
      <p className="max-w-md text-sm">{message || 'Ma\'lumotlarni yuklab bo\'lmadi'}</p>
      {onRetry && <button className="btn btn-outline" onClick={onRetry}>Qayta urinish</button>}
    </div>
  );
}

export function Pagination({ pagination, onPage }) {
  if (!pagination || pagination.pages <= 1) return null;
  const { page, pages } = pagination;
  return (
    <nav className="mt-8 flex items-center justify-center gap-3" aria-label="Sahifalash">
      <button className="btn btn-outline" disabled={page <= 1} onClick={() => onPage(page - 1)}><ChevronLeft className="h-4 w-4" />Oldingi</button>
      <span className="text-sm text-muted">{page} / {pages}</span>
      <button className="btn btn-outline" disabled={page >= pages} onClick={() => onPage(page + 1)}>Keyingi<ChevronRight className="h-4 w-4" /></button>
    </nav>
  );
}

export function Field({ label, hint, children }) {
  return (
    <label className="block space-y-1.5">
      <span className="text-sm font-medium">{label}</span>
      {children}
      {hint && <span className="block text-xs text-muted">{hint}</span>}
    </label>
  );
}

export function Select({ value, onChange, options, placeholder = 'Tanlang', className = '' }) {
  return (
    <select className={`input ${className}`} value={value ?? ''} onChange={(e) => onChange(e.target.value)}>
      <option value="">{placeholder}</option>
      {options.map((o) => (typeof o === 'string' ? <option key={o} value={o}>{o}</option> : <option key={o.value} value={o.value}>{o.label}</option>))}
    </select>
  );
}

export function Modal({ open, onClose, title, children }) {
  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div role="dialog" aria-modal="true" aria-label={title} className="card max-h-[90vh] w-full max-w-lg overflow-y-auto bg-bg p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-lg font-semibold">{title}</h2>
          <button onClick={onClose} aria-label="Yopish" className="rounded-lg p-1 hover:bg-surface"><X className="h-5 w-5" /></button>
        </div>
        {children}
      </div>
    </div>
  );
}

export const DemoBadge = () => <span className="badge bg-amber-500/15 text-amber-600 dark:text-amber-400">Namuna (demo)</span>;

export function StatusBadge({ status, label }) {
  const map = {
    pending: 'bg-amber-500/15 text-amber-600 dark:text-amber-400',
    accepted: 'bg-accent/15 text-accent', approved: 'bg-accent/15 text-accent',
    rejected: 'bg-red-500/15 text-red-500', withdrawn: 'bg-muted/20 text-muted',
  };
  return <span className={`badge ${map[status] || 'bg-muted/20 text-muted'}`}>{label}</span>;
}

export function PageHeader({ title, text, children }) {
  return (
    <div className="border-b border-line bg-surface/60">
      <div className="container-x flex flex-col gap-4 py-10 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold sm:text-4xl">{title}</h1>
          {text && <p className="mt-2 max-w-2xl text-muted">{text}</p>}
        </div>
        {children}
      </div>
    </div>
  );
}
