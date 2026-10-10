'use client';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Bookmark, BookmarkCheck, Flag, Send } from 'lucide-react';
import { api } from '@/lib/api';
import { useAuth } from '@/lib/auth';
import { useFetch } from '@/lib/useFetch';
import { REPORT_REASONS } from '@/lib/constants';
import { useToast } from './Providers';
import { Field, Modal, Select, Spinner } from './ui';

function LoginLink({ children = 'Ariza yuborish uchun kiring' }) {
  const pathname = usePathname();
  return <Link href={`/kirish?next=${encodeURIComponent(pathname)}`} className="btn btn-primary">{children}</Link>;
}

export function ApplyButton({ targetType, targetId, title }) {
  const { user, profile } = useAuth();
  const toast = useToast();
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);

  if (!user) return <LoginLink />;
  if (user.role !== 'athlete') return <p className="text-sm text-muted">Ariza faqat sportchi hisobidan yuboriladi.</p>;
  if (sent) return <p className="badge bg-accent/15 px-4 py-2 text-sm text-accent">Ariza yuborildi</p>;

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      const r = await api('/applications', { method: 'POST', body: { targetType, targetId, message: message || undefined } });
      toast.success(r.message);
      setSent(true); setOpen(false);
    } catch (err) {
      toast.error(err.message);
      if (err.status === 409) setSent(true);
    } finally { setBusy(false); }
  };

  return (
    <>
      <button className="btn btn-primary" onClick={() => setOpen(true)}><Send className="h-4 w-4" />Ariza yuborish</button>
      <Modal open={open} onClose={() => setOpen(false)} title="Ariza yuborish">
        <form onSubmit={submit} className="space-y-4">
          <p className="text-sm text-muted">«{title}» uchun ariza yuboriladi. {profile && `Arizada ${profile.firstName} ${profile.lastName} profili ko'rinadi.`}</p>
          <Field label="Xabar (ixtiyoriy)">
            <textarea className="input min-h-28" maxLength={1000} value={message} onChange={(e) => setMessage(e.target.value)} placeholder="O'zingiz va maqsadingiz haqida qisqacha yozing" />
          </Field>
          <div className="flex justify-end gap-2">
            <button type="button" className="btn btn-outline" onClick={() => setOpen(false)}>Bekor qilish</button>
            <button className="btn btn-primary" disabled={busy}>{busy && <Spinner className="h-4 w-4" />}Yuborish</button>
          </div>
        </form>
      </Modal>
    </>
  );
}

export function SaveButton({ targetType, id }) {
  const { user, isSaved, toggleSaved } = useAuth();
  const toast = useToast();
  const [busy, setBusy] = useState(false);
  const model = { tryout: 'Tryout', scholarship: 'Scholarship', club: 'Club' }[targetType];
  if (!user) return null;
  const saved = isSaved(model, id);
  const click = async () => {
    setBusy(true);
    try { const r = await toggleSaved(targetType, id); toast.success(r.message); } catch (e) { toast.error(e.message); } finally { setBusy(false); }
  };
  return (
    <button className="btn btn-outline" onClick={click} disabled={busy}>
      {saved ? <BookmarkCheck className="h-4 w-4 text-accent" /> : <Bookmark className="h-4 w-4" />}
      {saved ? 'Saqlangan' : 'Saqlab qo\'yish'}
    </button>
  );
}

export function ReportButton({ targetType, targetId }) {
  const { user } = useAuth();
  const toast = useToast();
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState('');
  const [details, setDetails] = useState('');
  const [busy, setBusy] = useState(false);
  if (!user) return null;

  const submit = async (e) => {
    e.preventDefault();
    if (!reason) return toast.error('Shikoyat sababini tanlang');
    setBusy(true);
    try {
      const r = await api('/reports', { method: 'POST', body: { targetType, targetId, reason, details: details || undefined } });
      toast.success(r.message); setOpen(false); setReason(''); setDetails('');
    } catch (err) { toast.error(err.message); } finally { setBusy(false); }
  };
  return (
    <>
      <button className="btn btn-outline" onClick={() => setOpen(true)}><Flag className="h-4 w-4" />Shikoyat qilish</button>
      <Modal open={open} onClose={() => setOpen(false)} title="Shubhali kontent haqida xabar berish">
        <form onSubmit={submit} className="space-y-4">
          <Field label="Sabab"><Select value={reason} onChange={setReason} options={REPORT_REASONS} placeholder="Sababni tanlang" /></Field>
          <Field label="Izoh (ixtiyoriy)"><textarea className="input min-h-24" maxLength={1000} value={details} onChange={(e) => setDetails(e.target.value)} /></Field>
          <div className="flex justify-end gap-2">
            <button type="button" className="btn btn-outline" onClick={() => setOpen(false)}>Bekor qilish</button>
            <button className="btn btn-primary" disabled={busy}>{busy && <Spinner className="h-4 w-4" />}Yuborish</button>
          </div>
        </form>
      </Modal>
    </>
  );
}

export function InviteButton({ athleteId }) {
  const { user } = useAuth();
  const toast = useToast();
  const [open, setOpen] = useState(false);
  const [tryoutId, setTryoutId] = useState('');
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);
  const tryouts = useFetch('/tryouts/mine', { limit: 50 }, { enabled: open });
  if (!user || user.role !== 'coach') return null;
  const options = (tryouts.data || []).filter((t) => t.status === 'approved' && new Date(t.deadline) > new Date()).map((t) => ({ value: t._id, label: t.title }));

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      const r = await api('/applications/invite', { method: 'POST', body: { athleteId, tryoutId: tryoutId || undefined, message: message || undefined } });
      toast.success(r.message); setOpen(false);
    } catch (err) { toast.error(err.message); } finally { setBusy(false); }
  };
  return (
    <>
      <button className="btn btn-accent" onClick={() => setOpen(true)}><Send className="h-4 w-4" />Taklif yuborish</button>
      <Modal open={open} onClose={() => setOpen(false)} title="Sportchini taklif qilish">
        <form onSubmit={submit} className="space-y-4">
          <Field label="Saralash e'loni (ixtiyoriy)" hint="Tanlanmasa, suhbatga taklif yuboriladi">
            <Select value={tryoutId} onChange={setTryoutId} options={options} placeholder="Suhbatga taklif" />
          </Field>
          <Field label="Xabar"><textarea className="input min-h-24" maxLength={1000} value={message} onChange={(e) => setMessage(e.target.value)} /></Field>
          <div className="flex justify-end gap-2">
            <button type="button" className="btn btn-outline" onClick={() => setOpen(false)}>Bekor qilish</button>
            <button className="btn btn-primary" disabled={busy}>{busy && <Spinner className="h-4 w-4" />}Yuborish</button>
          </div>
        </form>
      </Modal>
    </>
  );
}
