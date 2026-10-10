'use client';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { useFetch } from '@/lib/useFetch';
import { REGIONS, SPORTS } from '@/lib/constants';
import { Avatar } from '../cards';
import ImageUpload from '../ImageUpload';
import Repeater from '../Repeater';
import { ErrorState, Field, Select, Skeleton, Spinner } from '../ui';
import { MyListings, ReceivedApplications, Tabs, useSave, VerificationBanner } from './shared';

function Form({ p, reload }) {
  const [f, setF] = useState(null);
  const { busy, run } = useSave(reload);
  useEffect(() => { setF({ fullName: p.fullName, sport: p.sport, region: p.region, experienceYears: p.experienceYears, bio: p.bio || '', avatar: p.avatar || '', certificates: p.certificates || [] }); }, [p]);
  if (!f) return null;
  const set = (k) => (v) => setF((s) => ({ ...s, [k]: v }));
  const save = (e) => {
    e.preventDefault();
    const certificates = f.certificates.filter((c) => c.title).map((c) => ({ title: c.title, ...(c.url ? { url: c.url } : {}) }));
    run(() => api('/coaches/me', { method: 'PUT', body: { fullName: f.fullName, sport: f.sport, region: f.region, experienceYears: Number(f.experienceYears) || 0, bio: f.bio, avatar: f.avatar, certificates } }), 'Profil saqlandi');
  };
  return (
    <form onSubmit={save} className="space-y-6">
      <VerificationBanner status={p.status} note={p.moderationNote} what="Murabbiy profilingiz" />
      <div className="flex items-center gap-4"><Avatar src={f.avatar} name={f.fullName} size="h-20 w-20 text-2xl" /><ImageUpload label="Rasm yuklash" onUploaded={(r) => set('avatar')(r.url)} /></div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="To'liq ism"><input required className="input" value={f.fullName} onChange={(e) => set('fullName')(e.target.value)} /></Field>
        <Field label="Tajriba (yil)"><input type="number" min="0" max="70" className="input" value={f.experienceYears} onChange={(e) => set('experienceYears')(e.target.value)} /></Field>
        <Field label="Sport turi"><Select value={f.sport} onChange={set('sport')} options={SPORTS} /></Field>
        <Field label="Hudud"><Select value={f.region} onChange={set('region')} options={REGIONS} /></Field>
      </div>
      <Field label="Haqingizda"><textarea className="input min-h-32" maxLength={2000} value={f.bio} onChange={(e) => set('bio')(e.target.value)} /></Field>
      <section><h3 className="mb-2 font-display font-semibold">Sertifikatlar</h3>
        <Repeater items={f.certificates} onChange={set('certificates')} addLabel="Sertifikat qo'shish" empty="Sertifikatlar qo'shilmagan." fields={[{ key: 'title', label: 'Sertifikat nomi' }, { key: 'url', label: 'Havola (ixtiyoriy)' }]} /></section>
      <button className="btn btn-primary" disabled={busy}>{busy && <Spinner className="h-4 w-4" />}Saqlash</button>
    </form>
  );
}

export default function CoachDashboard({ tab, setTab }) {
  const { data, loading, error, reload } = useFetch('/coaches/me');
  return (
    <>
      <Tabs value={tab} onChange={setTab} tabs={[['profil', 'Profil'], ['arizalar', 'Kelgan arizalar'], ['elonlar', "E'lonlarim"]]} />
      {tab === 'arizalar' ? <ReceivedApplications /> : tab === 'elonlar' ? <MyListings />
        : loading ? <Skeleton className="h-96" /> : error ? <ErrorState message={error} onRetry={reload} /> : <Form p={data} reload={reload} />}
    </>
  );
}
