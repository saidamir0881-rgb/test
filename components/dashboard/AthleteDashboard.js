'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Trash2 } from 'lucide-react';
import { api, assetUrl } from '@/lib/api';
import { useAuth } from '@/lib/auth';
import { useFetch } from '@/lib/useFetch';
import { GOALS, LEVELS, REGIONS, SPORTS } from '@/lib/constants';
import { toInputDate, fmtDate, levelLabel } from '@/lib/format';
import { Avatar } from '../cards';
import ImageUpload from '../ImageUpload';
import Repeater from '../Repeater';
import { ErrorState, Field, Select, Skeleton, Spinner, EmptyState } from '../ui';
import { MyApplications, SavedList, Tabs, useSave } from './shared';

// Bo'sh qatorlarni va bo'sh maydonlarni olib tashlaydi (backend validatsiyasi bo'sh qiymatni qabul qilmaydi)
const clean = (arr, requiredKey) =>
  (arr || []).filter((x) => x[requiredKey]).map((x) => Object.fromEntries(Object.entries(x).filter(([k, v]) => v !== '' && v != null && !['_id', 'verified'].includes(k))));

function ProfileForm({ p, reload }) {
  const { reload: reloadAuth } = useAuth();
  const [f, setF] = useState(null);
  const { busy, run } = useSave(() => { reload(); reloadAuth(); });
  useEffect(() => {
    setF({
      sport: p.sport, region: p.region, experienceYears: p.experienceYears, bio: p.bio || '', phone: p.phone || '', avatar: p.avatar || '',
      goals: p.goals || [], isPublic: p.isPublic, media: p.media || [],
      competitionResults: p.competitionResults || [], trainingLog: p.trainingLog || [], certificates: p.certificates || [],
    });
  }, [p]);
  if (!f) return null;
  const set = (k) => (v) => setF((s) => ({ ...s, [k]: v }));

  const save = (e) => {
    e.preventDefault();
    const body = {
      sport: f.sport, region: f.region, experienceYears: Number(f.experienceYears) || 0, bio: f.bio, avatar: f.avatar, isPublic: f.isPublic, goals: f.goals,
      media: f.media.map(({ type, url, caption }) => ({ type, url, ...(caption ? { caption } : {}) })),
      competitionResults: clean(f.competitionResults, 'event'), trainingLog: clean(f.trainingLog, 'title'),
      certificates: clean(f.certificates, 'title').map(({ title, url }) => ({ title, ...(url ? { url } : {}) })),
    };
    if (f.phone) body.phone = f.phone;
    run(() => api(`/athletes/${p._id}`, { method: 'PUT', body }), 'Profil saqlandi');
  };
  const toggleGoal = (g) => set('goals')(f.goals.includes(g) ? f.goals.filter((x) => x !== g) : [...f.goals, g]);

  return (
    <form onSubmit={save} className="space-y-8">
      <div className="flex items-center gap-4">
        <Avatar src={f.avatar} name={`${p.firstName} ${p.lastName}`} size="h-20 w-20 text-2xl" />
        <div className="space-y-1">
          <ImageUpload label="Profil rasmini yuklash" onUploaded={(r) => set('avatar')(r.url)} />
          <Link href={`/sportchilar/${p._id}`} className="block text-sm font-semibold text-brand">Ommaviy profilni ko'rish</Link>
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Sport turi"><Select value={f.sport} onChange={set('sport')} options={SPORTS} /></Field>
        <Field label="Hudud"><Select value={f.region} onChange={set('region')} options={REGIONS} /></Field>
        <Field label="Sport tajribasi (yil)"><input type="number" min="0" max="60" className="input" value={f.experienceYears} onChange={(e) => set('experienceYears')(e.target.value)} /></Field>
        <Field label="Telefon" hint="Ommaga ko'rsatilmaydi"><input className="input" placeholder="+998901234567" value={f.phone} onChange={(e) => set('phone')(e.target.value)} /></Field>
      </div>
      <Field label="Sport tarjimayi holi"><textarea className="input min-h-32" maxLength={2000} value={f.bio} onChange={(e) => set('bio')(e.target.value)} /></Field>
      <fieldset>
        <legend className="mb-2 text-sm font-medium">Maqsadlarim</legend>
        <div className="flex flex-wrap gap-2">
          {GOALS.map((g) => (
            <label key={g.value} className={`cursor-pointer rounded-full border px-3 py-1.5 text-sm ${f.goals.includes(g.value) ? 'border-brand bg-brand/10 text-brand' : 'border-line'}`}>
              <input type="checkbox" className="sr-only" checked={f.goals.includes(g.value)} onChange={() => toggleGoal(g.value)} />{g.label}
            </label>
          ))}
        </div>
      </fieldset>
      <section>
        <h3 className="mb-2 font-display font-semibold">Musobaqa natijalari</h3>
        <Repeater items={f.competitionResults} onChange={set('competitionResults')} addLabel="Natija qo'shish" empty="Natijalar qo'shilmagan."
          fields={[{ key: 'event', label: 'Musobaqa nomi' }, { key: 'date', label: 'Sana', type: 'date' }, { key: 'place', label: "O'rin" }, { key: 'result', label: 'Natija' }]} />
      </section>
      <section>
        <h3 className="mb-2 font-display font-semibold">Mashg'ulot tarixi</h3>
        <Repeater items={f.trainingLog} onChange={set('trainingLog')} addLabel="Mashg'ulot qo'shish" empty="Mashg'ulotlar qo'shilmagan."
          fields={[{ key: 'title', label: "Mashg'ulot nomi" }, { key: 'date', label: 'Sana', type: 'date' }, { key: 'result', label: 'Natija' }]} />
      </section>
      <section>
        <h3 className="mb-2 font-display font-semibold">Sertifikatlar</h3>
        <Repeater items={f.certificates} onChange={set('certificates')} addLabel="Sertifikat qo'shish" empty="Sertifikatlar qo'shilmagan."
          fields={[{ key: 'title', label: 'Sertifikat nomi' }, { key: 'url', label: 'Havola (ixtiyoriy)' }]} />
      </section>
      <section>
        <h3 className="mb-2 font-display font-semibold">Video va rasmlar</h3>
        <div className="mb-3 grid gap-3 sm:grid-cols-3">
          {f.media.map((m, i) => (
            <div key={m._id || m.url} className="relative">
              {m.type === 'video' ? <video src={assetUrl(m.url)} className="aspect-video w-full rounded-xl bg-black" controls preload="metadata" /> : <img src={assetUrl(m.url)} alt="" className="aspect-video w-full rounded-xl object-cover" />}
              <button type="button" aria-label="O'chirish" onClick={() => set('media')(f.media.filter((_, j) => j !== i))} className="absolute right-2 top-2 rounded-lg bg-black/70 p-1.5 text-white"><Trash2 className="h-4 w-4" /></button>
            </div>
          ))}
        </div>
        <ImageUpload label="Rasm yoki video qo'shish" accept="image/jpeg,image/png,image/webp,video/mp4" onUploaded={(r) => set('media')([...f.media, { type: r.type, url: r.url }])} />
        <p className="mt-2 text-xs text-muted">Fayl yuklangandan so'ng «Saqlash» tugmasini bosing.</p>
      </section>
      <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={f.isPublic} onChange={(e) => set('isPublic')(e.target.checked)} />Profilim sportchilar katalogida ko'rinsin</label>
      <button className="btn btn-primary" disabled={busy}>{busy && <Spinner className="h-4 w-4" />}Saqlash</button>
    </form>
  );
}

function Achievements({ p, reload }) {
  const [f, setF] = useState({ title: '', date: '', level: 'maktab', description: '' });
  const { busy, run } = useSave(reload);
  const add = async (e) => {
    e.preventDefault();
    const body = { title: f.title, date: f.date, level: f.level, ...(f.description ? { description: f.description } : {}) };
    const r = await run(() => api('/achievements', { method: 'POST', body }));
    if (r) setF({ title: '', date: '', level: 'maktab', description: '' });
  };
  return (
    <div className="space-y-8">
      <form onSubmit={add} className="card grid gap-4 p-5 sm:grid-cols-2">
        <Field label="Yutuq nomi"><input required className="input" value={f.title} onChange={(e) => setF({ ...f, title: e.target.value })} /></Field>
        <Field label="Sana"><input required type="date" max={toInputDate(new Date())} className="input" value={f.date} onChange={(e) => setF({ ...f, date: e.target.value })} /></Field>
        <Field label="Daraja"><Select value={f.level} onChange={(v) => setF({ ...f, level: v || 'maktab' })} options={LEVELS} placeholder="Daraja" /></Field>
        <Field label="Izoh"><input className="input" value={f.description} onChange={(e) => setF({ ...f, description: e.target.value })} /></Field>
        <div className="sm:col-span-2"><button className="btn btn-primary" disabled={busy}>{busy && <Spinner className="h-4 w-4" />}Yutuq qo'shish</button>
          <span className="ml-3 text-xs text-muted">Yangi yutuq «foydalanuvchi kiritgan» deb belgilanadi, administrator tasdiqlagach «tekshirilgan» bo'ladi.</span></div>
      </form>
      {!p.achievements?.length ? <EmptyState title="Yutuqlar yo'q" text="Birinchi yutug'ingizni qo'shing." /> : (
        <ul className="space-y-3">
          {p.achievements.map((x) => (
            <li key={x._id} className="card flex items-center justify-between gap-3 p-4">
              <div><p className="font-semibold">{x.title}</p><p className="text-xs text-muted">{levelLabel(x.level)}, {fmtDate(x.date)}</p></div>
              <div className="flex items-center gap-2">
                <span className={`badge ${x.verified ? 'bg-accent/15 text-accent' : 'bg-muted/15 text-muted'}`}>{x.verified ? 'Tekshirilgan' : 'Foydalanuvchi kiritgan'}</span>
                <button className="rounded-lg p-2 text-red-500 hover:bg-red-500/10" aria-label="O'chirish" onClick={() => confirm("Yutuqni o'chirasizmi?") && run(() => api(`/achievements/${x._id}`, { method: 'DELETE' }))}><Trash2 className="h-4 w-4" /></button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default function AthleteDashboard({ tab, setTab }) {
  const { data, loading, error, reload } = useFetch('/athletes/me');
  return (
    <>
      <Tabs value={tab} onChange={setTab} tabs={[['profil', 'Profil'], ['yutuqlar', 'Yutuqlar'], ['arizalar', 'Arizalarim'], ['takliflar', 'Takliflar'], ['saqlanganlar', 'Saqlanganlar']]} />
      {tab === 'arizalar' ? <MyApplications kind="application" /> : tab === 'takliflar' ? <MyApplications kind="invitation" /> : tab === 'saqlanganlar' ? <SavedList />
        : loading ? <Skeleton className="h-96" /> : error ? <ErrorState message={error} onRetry={reload} />
        : tab === 'yutuqlar' ? <Achievements p={data} reload={reload} /> : <ProfileForm p={data} reload={reload} />}
    </>
  );
}
