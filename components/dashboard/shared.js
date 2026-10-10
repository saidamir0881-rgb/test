'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Check, Trash2, X } from 'lucide-react';
import { api } from '@/lib/api';
import { useFetch } from '@/lib/useFetch';
import { fmtDate, STATUS_LABEL, typeLabel } from '@/lib/format';
import { useToast } from '../Providers';
import { EmptyState, ErrorState, Pagination, Skeleton, StatusBadge } from '../ui';

export function Tabs({ tabs, value, onChange }) {
  return (
    <div role="tablist" className="mb-6 flex gap-1 overflow-x-auto border-b border-line">
      {tabs.map(([key, label]) => (
        <button key={key} role="tab" aria-selected={value === key} onClick={() => onChange(key)}
          className={`whitespace-nowrap border-b-2 px-4 py-2.5 text-sm font-semibold transition ${value === key ? 'border-brand text-brand' : 'border-transparent text-muted hover:text-ink'}`}>{label}</button>
      ))}
    </div>
  );
}

export function VerificationBanner({ status, note, what }) {
  if (status === 'approved') return null;
  const rejected = status === 'rejected';
  return (
    <div className={`mb-6 rounded-xl border p-4 text-sm ${rejected ? 'border-red-500/40 bg-red-500/10' : 'border-amber-500/40 bg-amber-500/10'}`}>
      {rejected ? `${what} rad etilgan.` : `${what} administrator tekshiruvida. Tasdiqlanguncha u ommaga ko'rinmaydi va e'lon joylay olmaysiz.`}
      {note && <span className="block text-muted">Izoh: {note}</span>}
    </div>
  );
}

export function useSave(reloadFn) {
  const toast = useToast();
  const [busy, setBusy] = useState(false);
  const run = async (fn, okMessage) => {
    setBusy(true);
    try { const r = await fn(); toast.success(okMessage || r?.message || 'Saqlandi'); if (reloadFn) reloadFn(); return r; } catch (e) { toast.error(e.message); return null; } finally { setBusy(false); }
  };
  return { busy, run };
}

const targetName = (t) => (t ? t.title || t.name || t.fullName || "O'chirilgan obyekt" : "O'chirilgan obyekt");

// Sportchining yuborgan arizalari yoki olgan takliflari
export function MyApplications({ kind }) {
  const [page, setPage] = useState(1);
  const { data, pagination, loading, error, reload } = useFetch('/applications/mine', { kind, page, limit: 10 });
  const { run } = useSave(reload);
  const respond = (id, status) => run(() => api(`/applications/${id}/status`, { method: 'PATCH', body: { status } }));

  if (loading) return <Skeleton className="h-40" />;
  if (error) return <ErrorState message={error} onRetry={reload} />;
  if (!data.length) {
    return kind === 'invitation'
      ? <EmptyState title="Takliflar yo'q" text="Murabbiylar sizni saralash yoki suhbatga taklif qilganda shu yerda ko'rinadi." />
      : <EmptyState title="Hali ariza yubormagansiz" text="Klub, saralash yoki stipendiya sahifasidan ariza yuboring." action={<Link href="/saralashlar" className="btn btn-primary">Saralashlarni ko'rish</Link>} />;
  }
  return (
    <>
      <ul className="space-y-3">
        {data.map((a) => (
          <li key={a._id} className="card flex flex-wrap items-center justify-between gap-3 p-4">
            <div>
              <p className="font-semibold">{kind === 'invitation' ? `${a.sender?.name || 'Murabbiy'}: ${targetName(a.target)}` : targetName(a.target)}</p>
              <p className="text-xs text-muted">{fmtDate(a.createdAt)}</p>
              {a.message && <p className="mt-1 text-sm">{a.message}</p>}
              {a.responseNote && <p className="mt-1 text-sm text-muted">Javob: {a.responseNote}</p>}
            </div>
            <div className="flex items-center gap-2">
              <StatusBadge status={a.status} label={STATUS_LABEL[a.status]} />
              {a.status === 'pending' && kind === 'invitation' && (
                <>
                  <button className="btn btn-accent px-3 py-1.5" onClick={() => respond(a._id, 'accepted')}><Check className="h-4 w-4" />Qabul qilish</button>
                  <button className="btn btn-outline px-3 py-1.5" onClick={() => respond(a._id, 'rejected')}><X className="h-4 w-4" />Rad etish</button>
                </>
              )}
              {a.status === 'pending' && kind !== 'invitation' && <button className="btn btn-outline px-3 py-1.5" onClick={() => respond(a._id, 'withdrawn')}>Qaytarib olish</button>}
            </div>
          </li>
        ))}
      </ul>
      <Pagination pagination={pagination} onPage={setPage} />
    </>
  );
}

// Klub/murabbiyga kelgan arizalar
export function ReceivedApplications() {
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState('');
  const { data, pagination, loading, error, reload } = useFetch('/applications/received', { status, page, limit: 10 });
  const { run } = useSave(reload);
  const respond = (id, st) => run(() => api(`/applications/${id}/status`, { method: 'PATCH', body: { status: st } }));

  return (
    <>
      <div className="mb-4 flex flex-wrap gap-2">
        {[['', 'Hammasi'], ['pending', 'Kutilmoqda'], ['accepted', 'Qabul qilingan'], ['rejected', 'Rad etilgan']].map(([v, l]) => (
          <button key={v} onClick={() => { setStatus(v); setPage(1); }} className={`rounded-full border px-3 py-1 text-sm ${status === v ? 'border-brand bg-brand/10 text-brand' : 'border-line'}`}>{l}</button>
        ))}
      </div>
      {loading ? <Skeleton className="h-40" /> : error ? <ErrorState message={error} onRetry={reload} /> : !data.length ? (
        <EmptyState title="Arizalar yo'q" text="Sportchilar e'loningizga ariza yuborganda shu yerda ko'rinadi." />
      ) : (
        <>
          <ul className="space-y-3">
            {data.map((a) => (
              <li key={a._id} className="card flex flex-wrap items-center justify-between gap-3 p-4">
                <div>
                  <Link href={`/sportchilar/${a.athlete?._id}`} className="font-semibold text-brand hover:underline">{a.athlete ? `${a.athlete.firstName} ${a.athlete.lastName}` : 'Sportchi'}</Link>
                  <p className="text-sm text-muted">{a.athlete && `${a.athlete.sport}, ${a.athlete.region}, ${a.athlete.age} yosh`} → {targetName(a.target)}</p>
                  {a.message && <p className="mt-1 text-sm">{a.message}</p>}
                  <p className="text-xs text-muted">{fmtDate(a.createdAt)}</p>
                </div>
                <div className="flex items-center gap-2">
                  <StatusBadge status={a.status} label={STATUS_LABEL[a.status]} />
                  {a.status === 'pending' && (
                    <>
                      <button className="btn btn-accent px-3 py-1.5" onClick={() => respond(a._id, 'accepted')}><Check className="h-4 w-4" />Qabul qilish</button>
                      <button className="btn btn-outline px-3 py-1.5" onClick={() => respond(a._id, 'rejected')}><X className="h-4 w-4" />Rad etish</button>
                    </>
                  )}
                </div>
              </li>
            ))}
          </ul>
          <Pagination pagination={pagination} onPage={setPage} />
        </>
      )}
    </>
  );
}

function ListingGroup({ path, base, title }) {
  const { data, loading, error, reload } = useFetch(`${path}/mine`, { limit: 50 });
  const { run } = useSave(reload);
  if (loading) return <Skeleton className="h-24" />;
  if (error) return <ErrorState message={error} onRetry={reload} />;
  return (
    <section>
      <h3 className="mb-3 font-display text-lg font-semibold">{title}</h3>
      {!data.length ? <p className="text-sm text-muted">Hali e'lon yo'q.</p> : (
        <ul className="space-y-3">
          {data.map((x) => (
            <li key={x._id} className="card flex flex-wrap items-center justify-between gap-3 p-4">
              <div>
                <Link href={`/${base}/${x._id}`} className="font-semibold hover:text-brand">{x.title}</Link>
                <p className="text-xs text-muted">Muddat: {fmtDate(x.deadline)}{x.type ? `, ${typeLabel(x.type)}` : ''}</p>
                {x.status === 'rejected' && x.moderationNote && <p className="text-xs text-red-500">Rad etish sababi: {x.moderationNote}</p>}
              </div>
              <div className="flex items-center gap-2">
                <StatusBadge status={x.status} label={x.status === 'pending' ? 'Tekshiruvda' : STATUS_LABEL[x.status]} />
                <button className="rounded-lg p-2 text-red-500 hover:bg-red-500/10" aria-label="O'chirish"
                  onClick={() => confirm("E'lonni o'chirishni tasdiqlaysizmi?") && run(() => api(`${path}/${x._id}`, { method: 'DELETE' }))}><Trash2 className="h-4 w-4" /></button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

export function MyListings({ withScholarships }) {
  return (
    <div className="space-y-8">
      <div className="flex justify-end"><Link href="/elon-joylash" className="btn btn-primary">Yangi e'lon joylash</Link></div>
      <ListingGroup path="/tryouts" base="saralashlar" title="Saralash e'lonlarim" />
      {withScholarships && <ListingGroup path="/scholarships" base="stipendiyalar" title="Stipendiya e'lonlarim" />}
    </div>
  );
}

export function SavedList() {
  const { data, loading, error, reload } = useFetch('/users/saved');
  if (loading) return <Skeleton className="h-32" />;
  if (error) return <ErrorState message={error} onRetry={reload} />;
  if (!data.length) return <EmptyState title="Saqlanganlar yo'q" text="E'lon sahifasidagi «Saqlab qo'yish» tugmasi orqali qo'shing." />;
  const href = { Tryout: 'saralashlar', Scholarship: 'stipendiyalar', Club: 'klublar' };
  const kind = { Tryout: 'Saralash', Scholarship: 'Stipendiya', Club: 'Klub' };
  return (
    <ul className="space-y-3">
      {data.map((s) => (
        <li key={`${s.targetModel}${s.item._id}`} className="card flex items-center justify-between gap-3 p-4">
          <Link href={`/${href[s.targetModel]}/${s.item._id}`} className="font-semibold hover:text-brand">{s.item.title || s.item.name}</Link>
          <span className="badge bg-brand/15 text-brand">{kind[s.targetModel]}</span>
        </li>
      ))}
    </ul>
  );
}
