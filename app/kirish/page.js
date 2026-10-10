'use client';
import { Suspense, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import { useToast } from '@/components/Providers';
import { Field, Spinner } from '@/components/ui';

function LoginForm() {
  const { login } = useAuth();
  const toast = useToast();
  const router = useRouter();
  const params = useSearchParams();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError(''); setBusy(true);
    try {
      await login(form.email, form.password);
      toast.success('Tizimga kirdingiz');
      const next = params.get('next');
      router.push(next && next.startsWith('/') ? next : '/profilim');
    } catch (err) { setError(err.message); } finally { setBusy(false); }
  };

  return (
    <div className="container-x flex justify-center py-16">
      <form onSubmit={submit} className="card w-full max-w-md space-y-5 p-8">
        <div><h1 className="font-display text-2xl font-bold">Kirish</h1><p className="mt-1 text-sm text-muted">Hisobingizga kiring.</p></div>
        {error && <p role="alert" className="rounded-xl bg-red-500/10 p-3 text-sm text-red-500">{error}</p>}
        <Field label="Email"><input type="email" required className="input" autoComplete="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></Field>
        <Field label="Parol"><input type="password" required className="input" autoComplete="current-password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} /></Field>
        <button className="btn btn-primary w-full" disabled={busy}>{busy && <Spinner className="h-4 w-4" />}Kirish</button>
        <p className="text-center text-sm text-muted">Hisobingiz yo'qmi? <Link href="/royxatdan-otish" className="font-semibold text-brand">Ro'yxatdan o'ting</Link></p>
      </form>
    </div>
  );
}

export default function LoginPage() {
  return <Suspense fallback={<div className="flex justify-center py-24"><Spinner className="h-8 w-8" /></div>}><LoginForm /></Suspense>;
}
