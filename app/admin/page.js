'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Ban, Check, ShieldCheck, X } from 'lucide-react';
import { api } from '@/lib/api';
import { useFetch } from '@/lib/useFetch';
import { fmtDate, reasonLabel, roleLabel, STATUS_LABEL } from '@/lib/format';
import RequireRole from '@/components/RequireRole';
import { EmptyState, ErrorState, PageHeader, Pagination, Skeleton, StatusBadge } from '@/components/ui';
import { Tabs, useSave } from '@/components/dashboard/shared';

const MONTHS = ['yan', 'fev', 'mar', 'apr', 'may', 'iyun', 'iyul', 'avg', 'sen', 'okt', 'noy', 'dek'];

function StatCard({ label, value }) {
  return <div className="card p-5"><p className="text-sm text-muted">{label}</p><p className="mt-1 font-display text-3xl font-bold">{value ?? 0}</p></div>;
}

function Stats() {
  const { data: s, loading, error, reload } = useFetch('/admin/stats');
  if (loading) return <Skeleton className="h-96" />;
  if (error) return <ErrorState message={error} onRetry={reload} />;
  const users = Object.fromEntries(s.usersByRole.map((x) => [x._id, x.count]));
  const apps = Object.fromEntries(s.applicationsByStatus.map((x) => [x._id, x.count]));
  const totalUsers = Object.values(users).reduce((a, b) => a + b, 0);
  const sports = s.athletesBySport.map((x) => ({ name: x._id, soni: x.count }));
  const months = s.newUsersByMonth.map((x) => ({ name: `${MONTHS[x.month - 1]} ${x.year}`, soni: x.count }));
  const tip = { contentStyle: { background: 'rgb(var(--surface))', border: '1px solid rgb(var(--line))', borderRadius: 12 } };
  return (
    <div className="space-y-8">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Foydalanuvchilar" value={totalUsers} />
        <StatCard label="Sportchilar" value={s.athletes} />
        <StatCard label="Tasdiqlangan klublar" value={s.clubs} />
        <StatCard label="Tasdiqlangan murabbiylar" value={s.coaches} />
        <StatCard label="Faol saralashlar" value={s.activeTryouts} />
        <StatCard label="Faol stipendiyalar" value={s.activeScholarships} />
        <StatCard label="Tekshiruv kutmoqda" value={s.pendingModeration} />
        <StatCard label="Ochiq shikoyatlar" value={s.openReports} />
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <section className="card p-5">
          <h3 className="mb-4 font-display font-semibold">Sportchilar sport turlari bo'yicha</h3>
          {sports.length ? <div className="h-64"><ResponsiveContainer><BarChart data={sports}><CartesianGrid strokeDasharray="3 3" stroke="rgb(var(--line))" /><XAxis dataKey="name" tick={{ fontSize: 11, fill: 'rgb(var(--muted))' }} interval={0} angle={-30} textAnchor="end" height={60} /><YAxis allowDecimals={false} tick={{ fill: 'rgb(var(--muted))' }} /><Tooltip {...tip} /><Bar dataKey="soni" name="Soni" fill="rgb(var(--brand))" radius={[6, 6, 0, 0]} /></BarChart></ResponsiveContainer></div> : <p className="text-sm text-muted">Ma'lumot yo'q</p>}
        </section>
        <section className="card p-5">
          <h3 className="mb-4 font-display font-semibold">Oxirgi 6 oyda ro'yxatdan o'tganlar</h3>
          {months.length ? <div className="h-64"><ResponsiveContainer><LineChart data={months}><CartesianGrid strokeDasharray="3 3" stroke="rgb(var(--line))" /><XAxis dataKey="name" tick={{ fontSize: 11, fill: 'rgb(var(--muted))' }} /><YAxis allowDecimals={false} tick={{ fill: 'rgb(var(--muted))' }} /><Tooltip {...tip} /><Line dataKey="soni" name="Soni" stroke="rgb(var(--accent))" strokeWidth={3} dot /></LineChart></ResponsiveContainer></div> : <p className="text-sm text-muted">Ma'lumot yo'q</p>}
        </section>
      </div>
      <section className="card p-5">
        <h3 className="mb-3 font-display font-semibold">Arizalar holati</h3>
        <div className="flex flex-wrap gap-3 text-sm">{['pending', 'accepted', 'rejected', 'withdrawn'].map((k) => <span key={k} className="badge bg-muted/15 px-3 py-1">{STATUS_LABEL[k]}: {apps[k] || 0}</span>)}</div>
      </section>
    </div>
  );
}

const GROUPS = {
  coach: { title: 'Murabbiy profillari', href: 'murabbiylar', name: (x) => x.fullName, sub: (x) => `${x.sport}, ${x.region}` },
  club: { title: 'Klub profillari', href: 'klublar', name: (x) => x.name, sub: (x) => `${x.sports?.join(', ')}, ${x.region}` },
  tryout: { title: "Saralash e'lonlari", href: 'saralashlar', name: (x) => x.title, sub: (x) => `${x.organization}, ${fmtDate(x.date)}` },
  scholarship: { title: "Stipendiya e'lonlari", href: 'stipendiyalar', name: (x) => x.title, sub: (x) => `${x.organization}, muddat: ${fmtDate(x.deadline)}` },
};

function Pending() {
  const { data, loading, error, reload } = useFetch('/admin/pending');
  const { run } = useSave(reload);
  const decide = (type, id, status) => {
    let note;
    if (status === 'rejected') { note = prompt('Rad etish sababini yozing (ixtiyoriy):') ?? undefined; if (note === undefined) return; }
    run(() => api(`/admin/moderate/${type}/${id}`, { method: 'PATCH', body: { status, note: note || undefined } }));
  };
  if (loading) return <Skeleton className="h-64" />;
  if (error) return <ErrorState message={error} onRetry={reload} />;
  const total = Object.values(data).reduce((a, b) => a + b.length, 0);
  if (!total) return <EmptyState title="Tekshiruv kutayotgan narsa yo'q" text="Yangi profil va e'lonlar shu yerda paydo bo'ladi." />;
  return (
    <div className="space-y-8">
      {Object.entries(GROUPS).map(([type, g]) => data[type]?.length > 0 && (
        <section key={type}>
          <h3 className="mb-3 font-display font-semibold">{g.title} ({data[type].length})</h3>
          <ul className="space-y-3">
            {data[type].map((x) => (
              <li key={x._id} className="card flex flex-wrap items-center justify-between gap-3 p-4">
                <div><Link href={`/${g.href}/${x._id}`} className="font-semibold text-brand hover:underline">{g.name(x)}</Link><p className="text-xs text-muted">{g.sub(x)}</p></div>
                <div className="flex gap-2">
                  <button className="btn btn-accent px-3 py-1.5" onClick={() => decide(type, x._id, 'approved')}><Check className="h-4 w-4" />Tasdiqlash</button>
                  <button className="btn btn-outline px-3 py-1.5" onClick={() => decide(type, x._id, 'rejected')}><X className="h-4 w-4" />Rad etish</button>
                </div>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}

function Users() {
  const [page, setPage] = useState(1);
  const [q, setQ] = useState('');
  const [applied, setApplied] = useState('');
  const [role, setRole] = useState('');
  const { data, pagination, loading, error, reload } = useFetch('/admin/users', { q: applied, role, page, limit: 20 });
  const { run } = useSave(reload);
  return (
    <>
      <form className="mb-4 flex flex-wrap gap-2" onSubmit={(e) => { e.preventDefault(); setApplied(q); setPage(1); }}>
        <input className="input max-w-xs" placeholder="Ism yoki email" value={q} onChange={(e) => setQ(e.target.value)} />
        <select className="input max-w-[180px]" value={role} onChange={(e) => { setRole(e.target.value); setPage(1); }}>
          <option value="">Barcha rollar</option>{['athlete', 'coach', 'club', 'admin'].map((r) => <option key={r} value={r}>{roleLabel(r)}</option>)}
        </select>
        <button className="btn btn-primary">Qidirish</button>
      </form>
      {loading ? <Skeleton className="h-64" /> : error ? <ErrorState message={error} onRetry={reload} /> : !data.length ? <EmptyState title="Foydalanuvchi topilmadi" /> : (
        <>
          <div className="card overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-line text-muted"><tr><th className="p-3">Ism</th><th className="p-3">Email</th><th className="p-3">Rol</th><th className="p-3">Sana</th><th className="p-3" /></tr></thead>
              <tbody>
                {data.map((u) => (
                  <tr key={u._id} className="border-b border-line last:border-0">
                    <td className="p-3 font-medium">{u.name}{u.isBlocked && <span className="badge ml-2 bg-red-500/15 text-red-500">Bloklangan</span>}</td>
                    <td className="p-3">{u.email}</td><td className="p-3">{roleLabel(u.role)}</td><td className="p-3">{fmtDate(u.createdAt)}</td>
                    <td className="p-3 text-right">{u.role !== 'admin' && <button className="btn btn-outline px-3 py-1.5" onClick={() => run(() => api(`/admin/users/${u._id}/block`, { method: 'PATCH' }))}><Ban className="h-4 w-4" />{u.isBlocked ? 'Blokdan chiqarish' : 'Bloklash'}</button>}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Pagination pagination={pagination} onPage={setPage} />
        </>
      )}
    </>
  );
}

const TARGET_HREF = { athlete: 'sportchilar', coach: 'murabbiylar', club: 'klublar', tryout: 'saralashlar', scholarship: 'stipendiyalar' };
const TARGET_LABEL = { athlete: 'Sportchi', coach: 'Murabbiy', club: 'Klub', tryout: 'Saralash', scholarship: 'Stipendiya' };

function Reports() {
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState('open');
  const { data, pagination, loading, error, reload } = useFetch('/admin/reports', { status, page, limit: 20 });
  const { run } = useSave(reload);
  const review = (id, st) => {
    const adminNote = prompt('Izoh (ixtiyoriy):');
    if (adminNote === null) return;
    run(() => api(`/admin/reports/${id}`, { method: 'PATCH', body: { status: st, adminNote: adminNote || undefined } }));
  };
  return (
    <>
      <div className="mb-4 flex gap-2">
        {[['open', 'Ochiq'], ['reviewed', "Ko'rib chiqilgan"], ['dismissed', 'Rad etilgan']].map(([v, l]) => (
          <button key={v} onClick={() => { setStatus(v); setPage(1); }} className={`rounded-full border px-3 py-1 text-sm ${status === v ? 'border-brand bg-brand/10 text-brand' : 'border-line'}`}>{l}</button>
        ))}
      </div>
      {loading ? <Skeleton className="h-48" /> : error ? <ErrorState message={error} onRetry={reload} /> : !data.length ? <EmptyState title="Shikoyatlar yo'q" text="Soxta profil va shubhali e'lonlar haqidagi xabarlar shu yerda ko'rinadi." /> : (
        <>
          <ul className="space-y-3">
            {data.map((r) => (
              <li key={r._id} className="card space-y-2 p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="badge bg-red-500/15 text-red-500">{reasonLabel(r.reason)}</span>
                    <Link href={`/${TARGET_HREF[r.targetType]}/${r.targetId}`} className="text-sm font-semibold text-brand hover:underline">{TARGET_LABEL[r.targetType]}ni ko'rish</Link>
                  </div>
                  <StatusBadge status={r.status === 'open' ? 'pending' : 'accepted'} label={r.status === 'open' ? 'Ochiq' : r.status === 'reviewed' ? "Ko'rib chiqilgan" : 'Rad etilgan'} />
                </div>
                {r.details && <p className="text-sm">{r.details}</p>}
                <p className="text-xs text-muted">Yuboruvchi: {r.reporter?.name} ({r.reporter?.email}), {fmtDate(r.createdAt)}</p>
                {r.adminNote && <p className="text-xs text-muted">Admin izohi: {r.adminNote}</p>}
                {r.status === 'open' && (
                  <div className="flex gap-2">
                    <button className="btn btn-accent px-3 py-1.5" onClick={() => review(r._id, 'reviewed')}>Ko'rib chiqildi</button>
                    <button className="btn btn-outline px-3 py-1.5" onClick={() => review(r._id, 'dismissed')}>Asossiz</button>
                  </div>
                )}
              </li>
            ))}
          </ul>
          <Pagination pagination={pagination} onPage={setPage} />
        </>
      )}
    </>
  );
}

export default function AdminPage() {
  const [tab, setTab] = useState('stats');
  return (
    <>
      <PageHeader title="Admin panel" text="Foydalanuvchilar, tekshiruvlar, shikoyatlar va platforma statistikasi." />
      <div className="container-x py-8">
        <RequireRole roles={['admin']}>
          <Tabs value={tab} onChange={setTab} tabs={[['stats', 'Statistika'], ['pending', 'Tekshiruv'], ['users', 'Foydalanuvchilar'], ['reports', 'Shikoyatlar']]} />
          {tab === 'stats' ? <Stats /> : tab === 'pending' ? <Pending /> : tab === 'users' ? <Users /> : <Reports />}
        </RequireRole>
      </div>
    </>
  );
}
