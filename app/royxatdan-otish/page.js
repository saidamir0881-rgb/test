'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Building2, GraduationCap, User } from 'lucide-react';
import { useAuth } from '@/lib/auth';
import { useToast } from '@/components/Providers';
import { REGIONS, SPORTS } from '@/lib/constants';
import { Field, Select, Spinner } from '@/components/ui';

const ROLES = [
  { value: 'athlete', label: 'Sportchi', icon: User },
  { value: 'coach', label: 'Murabbiy', icon: GraduationCap },
  { value: 'club', label: 'Sport klubi', icon: Building2 },
];

function ageOf(dateStr) {
  if (!dateStr) return null;
  const d = new Date(dateStr);
  const now = new Date();
  let a = now.getFullYear() - d.getFullYear();
  if (now.getMonth() < d.getMonth() || (now.getMonth() === d.getMonth() && now.getDate() < d.getDate())) a -= 1;
  return a;
}

export default function RegisterPage() {
  const { register } = useAuth();
  const toast = useToast();
  const router = useRouter();
  const [role, setRole] = useState('athlete');
  const [f, setF] = useState({ name: '', email: '', password: '', sport: '', region: '', birthDate: '', experienceYears: '', guardianName: '', guardianPhone: '', guardianConsent: false });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const set = (k) => (v) => setF((s) => ({ ...s, [k]: v }));
  const inp = (k) => ({ value: f[k], onChange: (e) => set(k)(e.target.value) });
  const minor = role === 'athlete' && ageOf(f.birthDate) !== null && ageOf(f.birthDate) < 18;

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    if (!f.sport || !f.region) return setError('Sport turi va hududni tanlang');
    const body = { role, name: f.name, email: f.email, password: f.password, sport: f.sport, region: f.region };
    if (role !== 'club' && f.experienceYears !== '') body.experienceYears = Number(f.experienceYears);
    if (role === 'athlete') {
      body.birthDate = f.birthDate;
      if (minor) Object.assign(body, { guardianName: f.guardianName, guardianPhone: f.guardianPhone, guardianConsent: f.guardianConsent });
    }
    setBusy(true);
    try {
      const r = await register(body);
      toast.success(r.message);
      router.push('/profilim');
    } catch (err) { setError(err.message); } finally { setBusy(false); }
  };

  return (
    <div className="container-x flex justify-center py-12">
      <form onSubmit={submit} className="card w-full max-w-xl space-y-5 p-8">
        <div><h1 className="font-display text-2xl font-bold">Ro'yxatdan o'tish</h1><p className="mt-1 text-sm text-muted">Rolingizni tanlang va ma'lumotlarni kiriting.</p></div>

        <div role="radiogroup" aria-label="Rol" className="grid grid-cols-3 gap-2">
          {ROLES.map(({ value, label, icon: Icon }) => (
            <button type="button" key={value} role="radio" aria-checked={role === value} onClick={() => setRole(value)}
              className={`flex flex-col items-center gap-1 rounded-xl border p-3 text-sm font-medium transition ${role === value ? 'border-brand bg-brand/10 text-brand' : 'border-line hover:border-brand'}`}>
              <Icon className="h-5 w-5" />{label}
            </button>
          ))}
        </div>

        {error && <p role="alert" className="rounded-xl bg-red-500/10 p-3 text-sm text-red-500">{error}</p>}

        <Field label={role === 'club' ? 'Klub nomi' : role === 'athlete' ? 'Ism va familiya' : "To'liq ism"}><input required className="input" {...inp('name')} /></Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Email"><input type="email" required className="input" autoComplete="email" {...inp('email')} /></Field>
          <Field label="Parol" hint="Kamida 8 ta belgi"><input type="password" required minLength={8} className="input" autoComplete="new-password" {...inp('password')} /></Field>
          <Field label="Sport turi"><Select value={f.sport} onChange={set('sport')} options={SPORTS} /></Field>
          <Field label="Hudud"><Select value={f.region} onChange={set('region')} options={REGIONS} /></Field>
          {role === 'athlete' && <Field label="Tug'ilgan sana"><input type="date" required className="input" max={new Date().toISOString().slice(0, 10)} {...inp('birthDate')} /></Field>}
          {role !== 'club' && <Field label="Sport tajribasi (yil)"><input type="number" min="0" max="60" className="input" {...inp('experienceYears')} /></Field>}
        </div>

        {minor && (
          <fieldset className="space-y-4 rounded-xl border border-amber-500/40 bg-amber-500/5 p-4">
            <legend className="px-1 text-sm font-semibold">Ota-ona yoki qonuniy vakil</legend>
            <p className="text-xs text-muted">18 yoshgacha bo'lgan sportchilar uchun vakil roziligi shart. Bu ma'lumotlar ommaga ko'rsatilmaydi.</p>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Vakil ismi"><input required className="input" {...inp('guardianName')} /></Field>
              <Field label="Vakil telefoni"><input required className="input" placeholder="+998901234567" {...inp('guardianPhone')} /></Field>
            </div>
            <label className="flex items-start gap-2 text-sm">
              <input type="checkbox" required className="mt-1" checked={f.guardianConsent} onChange={(e) => set('guardianConsent')(e.target.checked)} />
              Ota-ona yoki qonuniy vakil bu platformada ro'yxatdan o'tishga rozilik bergan.
            </label>
          </fieldset>
        )}

        <button className="btn btn-primary w-full" disabled={busy}>{busy && <Spinner className="h-4 w-4" />}Ro'yxatdan o'tish</button>
        <p className="text-center text-sm text-muted">Hisobingiz bormi? <Link href="/kirish" className="font-semibold text-brand">Kirish</Link></p>
      </form>
    </div>
  );
}
