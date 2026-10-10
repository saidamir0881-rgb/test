'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { useAuth } from '@/lib/auth';
import { LISTING_REGIONS, LISTING_SPORTS, SCHOLARSHIP_TYPES } from '@/lib/constants';
import RequireRole from '@/components/RequireRole';
import { useToast } from '@/components/Providers';
import { Field, PageHeader, Select, Spinner } from '@/components/ui';

const EMPTY = { title: '', organization: '', sport: '', region: '', address: '', date: '', deadline: '', minAge: '', maxAge: '', requirements: '', description: '', link: '', type: '' };
const today = () => new Date().toISOString().slice(0, 10);

function Form() {
  const { user } = useAuth();
  const toast = useToast();
  const router = useRouter();
  const [kind, setKind] = useState('tryout');
  const [f, setF] = useState(EMPTY);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const set = (k) => (v) => setF((s) => ({ ...s, [k]: v }));
  const inp = (k) => ({ value: f[k], onChange: (e) => set(k)(e.target.value) });
  const canScholarship = user.role === 'club' || user.role === 'admin';

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    if (!f.sport) return setError('Sport turini tanlang');
    const body = { title: f.title, sport: f.sport, deadline: f.deadline };
    ['region', 'description', 'link'].forEach((k) => { if (f[k]) body[k] = f[k]; });
    if (f.minAge !== '') body.minAge = Number(f.minAge);
    if (f.maxAge !== '') body.maxAge = Number(f.maxAge);
    if (user.role === 'admin' && f.organization) body.organization = f.organization;
    if (kind === 'tryout') {
      Object.assign(body, { address: f.address, date: f.date });
      if (f.requirements) body.requirements = f.requirements;
    } else {
      if (!f.type) return setError('Yordam turini tanlang');
      Object.assign(body, { type: f.type, requirements: f.requirements });
    }
    setBusy(true);
    try {
      const r = await api(kind === 'tryout' ? '/tryouts' : '/scholarships', { method: 'POST', body });
      toast.success(r.message);
      router.push(`/profilim?tab=elonlar`);
    } catch (err) { setError(err.message); } finally { setBusy(false); }
  };

  return (
    <form onSubmit={submit} className="card space-y-5 p-8">
      {canScholarship && (
        <div role="radiogroup" aria-label="E'lon turi" className="grid grid-cols-2 gap-2">
          {[['tryout', "Saralash e'loni"], ['scholarship', "Stipendiya e'loni"]].map(([v, l]) => (
            <button type="button" key={v} role="radio" aria-checked={kind === v} onClick={() => setKind(v)}
              className={`rounded-xl border p-3 text-sm font-semibold ${kind === v ? 'border-brand bg-brand/10 text-brand' : 'border-line'}`}>{l}</button>
          ))}
        </div>
      )}
      {error && <p role="alert" className="rounded-xl bg-red-500/10 p-3 text-sm text-red-500">{error}</p>}
      <Field label={kind === 'tryout' ? 'Tadbir nomi' : 'Imkoniyat nomi'}><input required minLength={3} className="input" {...inp('title')} /></Field>
      {user.role === 'admin' && <Field label="Tashkilot nomi" hint="Bo'sh qoldirilsa «TalentSport» yoziladi"><input className="input" {...inp('organization')} /></Field>}
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Sport turi"><Select value={f.sport} onChange={set('sport')} options={LISTING_SPORTS} /></Field>
        <Field label="Hudud"><Select value={f.region} onChange={set('region')} options={LISTING_REGIONS} placeholder="Butun respublika" /></Field>
        {kind === 'scholarship' && <Field label="Yordam turi"><Select value={f.type} onChange={set('type')} options={SCHOLARSHIP_TYPES} /></Field>}
        {kind === 'tryout' && <Field label="Manzil"><input required className="input" {...inp('address')} /></Field>}
        {kind === 'tryout' && <Field label="Tadbir sanasi"><input required type="date" min={today()} className="input" {...inp('date')} /></Field>}
        <Field label="Ro'yxatdan o'tish muddati" hint={kind === 'tryout' ? 'Tadbir sanasidan oldin bo\'lishi kerak' : undefined}><input required type="date" min={today()} className="input" {...inp('deadline')} /></Field>
        <Field label="Minimal yosh"><input type="number" min="0" max="99" className="input" {...inp('minAge')} /></Field>
        <Field label="Maksimal yosh"><input type="number" min="0" max="99" className="input" {...inp('maxAge')} /></Field>
      </div>
      <Field label={kind === 'tryout' ? 'Qabul talablari' : 'Talablar'}><textarea required={kind === 'scholarship'} className="input min-h-24" maxLength={2000} {...inp('requirements')} /></Field>
      <Field label="Tavsif"><textarea className="input min-h-28" maxLength={3000} {...inp('description')} /></Field>
      <Field label="Qo'shimcha havola"><input type="url" className="input" placeholder="https://" {...inp('link')} /></Field>
      <p className="text-xs text-muted">{user.role === 'admin' ? "Administrator e'lonlari darhol e'lon qilinadi." : "E'lon administrator tomonidan tekshirilgandan so'ng ommaga ko'rinadi."}</p>
      <button className="btn btn-primary" disabled={busy}>{busy && <Spinner className="h-4 w-4" />}E'lon joylash</button>
    </form>
  );
}

export default function PostPage() {
  return (
    <>
      <PageHeader title="E'lon joylash" text="Saralash yoki stipendiya e'lonini yarating." />
      <div className="container-x max-w-3xl py-8"><RequireRole roles={['club', 'coach', 'admin']}><Form /></RequireRole></div>
    </>
  );
}
