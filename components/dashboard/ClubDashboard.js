'use client';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { useFetch } from '@/lib/useFetch';
import { REGIONS, SPORTS } from '@/lib/constants';
import { Avatar } from '../cards';
import ImageUpload from '../ImageUpload';
import { ErrorState, Field, Select, Skeleton, Spinner } from '../ui';
import { MyListings, ReceivedApplications, Tabs, useSave, VerificationBanner } from './shared';

function Form({ p, reload }) {
  const [f, setF] = useState(null);
  const { busy, run } = useSave(reload);
  useEffect(() => {
    setF({
      name: p.name, logo: p.logo || '', region: p.region, sports: p.sports || [], address: p.address || '',
      lat: p.location?.lat ?? '', lng: p.location?.lng ?? '', requirements: p.requirements || '', description: p.description || '',
      phone: p.contact?.phone || '', email: p.contact?.email || '', telegram: p.contact?.telegram || '',
    });
  }, [p]);
  if (!f) return null;
  const set = (k) => (v) => setF((s) => ({ ...s, [k]: v }));
  const toggleSport = (s) => set('sports')(f.sports.includes(s) ? f.sports.filter((x) => x !== s) : [...f.sports, s]);

  const save = (e) => {
    e.preventDefault();
    const body = {
      name: f.name, logo: f.logo, region: f.region, sports: f.sports, address: f.address, requirements: f.requirements, description: f.description,
      contact: { phone: f.phone, email: f.email, telegram: f.telegram },
    };
    if (f.lat !== '' && f.lng !== '') body.location = { lat: Number(f.lat), lng: Number(f.lng) };
    run(() => api(`/clubs/${p._id}`, { method: 'PUT', body }), 'Klub ma\'lumotlari saqlandi');
  };

  return (
    <form onSubmit={save} className="space-y-6">
      <VerificationBanner status={p.status} note={p.moderationNote} what="Klub profilingiz" />
      <div className="flex items-center gap-4"><Avatar src={f.logo} name={f.name} size="h-20 w-20 text-2xl" /><ImageUpload label="Logotip yuklash" onUploaded={(r) => set('logo')(r.url)} /></div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Klub nomi"><input required className="input" value={f.name} onChange={(e) => set('name')(e.target.value)} /></Field>
        <Field label="Hudud"><Select value={f.region} onChange={set('region')} options={REGIONS} /></Field>
        <Field label="Mashg'ulot manzili"><input className="input" value={f.address} onChange={(e) => set('address')(e.target.value)} /></Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Kenglik (lat)" hint="Xarita uchun"><input type="number" step="any" className="input" value={f.lat} onChange={(e) => set('lat')(e.target.value)} /></Field>
          <Field label="Uzunlik (lng)"><input type="number" step="any" className="input" value={f.lng} onChange={(e) => set('lng')(e.target.value)} /></Field>
        </div>
        <Field label="Telefon"><input className="input" value={f.phone} onChange={(e) => set('phone')(e.target.value)} /></Field>
        <Field label="Email"><input className="input" value={f.email} onChange={(e) => set('email')(e.target.value)} /></Field>
        <Field label="Telegram"><input className="input" value={f.telegram} onChange={(e) => set('telegram')(e.target.value)} /></Field>
      </div>
      <fieldset>
        <legend className="mb-2 text-sm font-medium">Sport yo'nalishlari</legend>
        <div className="flex flex-wrap gap-2">
          {SPORTS.map((s) => (
            <label key={s} className={`cursor-pointer rounded-full border px-3 py-1.5 text-sm ${f.sports.includes(s) ? 'border-brand bg-brand/10 text-brand' : 'border-line'}`}>
              <input type="checkbox" className="sr-only" checked={f.sports.includes(s)} onChange={() => toggleSport(s)} />{s}
            </label>
          ))}
        </div>
      </fieldset>
      <Field label="Qabul qilinadigan sportchilar talablari"><textarea className="input min-h-24" maxLength={2000} value={f.requirements} onChange={(e) => set('requirements')(e.target.value)} /></Field>
      <Field label="Klub haqida"><textarea className="input min-h-28" maxLength={3000} value={f.description} onChange={(e) => set('description')(e.target.value)} /></Field>
      <button className="btn btn-primary" disabled={busy || f.sports.length === 0}>{busy && <Spinner className="h-4 w-4" />}Saqlash</button>
    </form>
  );
}

export default function ClubDashboard({ tab, setTab }) {
  const { data, loading, error, reload } = useFetch('/clubs/me');
  return (
    <>
      <Tabs value={tab} onChange={setTab} tabs={[['profil', 'Klub profili'], ['arizalar', 'Kelgan arizalar'], ['elonlar', "E'lonlarim"]]} />
      {tab === 'arizalar' ? <ReceivedApplications /> : tab === 'elonlar' ? <MyListings withScholarships />
        : loading ? <Skeleton className="h-96" /> : error ? <ErrorState message={error} onRetry={reload} /> : <Form p={data} reload={reload} />}
    </>
  );
}
