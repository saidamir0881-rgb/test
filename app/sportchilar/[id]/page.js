'use client';
import Link from 'next/link';
import { Award, BadgeCheck, Calendar, MapPin, ShieldAlert, UserCheck } from 'lucide-react';
import DetailShell from '@/components/DetailShell';
import { InviteButton, ReportButton } from '@/components/ActionButtons';
import { Avatar } from '@/components/cards';
import { DemoBadge } from '@/components/ui';
import { api, assetUrl } from '@/lib/api';
import { useAuth } from '@/lib/auth';
import { fmtDate, levelLabel } from '@/lib/format';
import { useToast } from '@/components/Providers';

const UserEntered = () => <span className="badge bg-muted/15 text-muted"><UserCheck className="h-3 w-3" />Foydalanuvchi kiritgan</span>;
const Verified = () => <span className="badge bg-accent/15 text-accent"><BadgeCheck className="h-3 w-3" />Tekshirilgan</span>;

function Block({ title, children, note }) {
  return (
    <section className="card p-6">
      <h2 className="mb-4 font-display text-lg font-semibold">{title}</h2>
      {children}
      {note && <p className="mt-3 text-xs text-muted">{note}</p>}
    </section>
  );
}

function Profile({ a, reload }) {
  const { user } = useAuth();
  const toast = useToast();
  const name = `${a.firstName} ${a.lastName}`;
  const isOwner = user?.role === 'athlete' && a.user === user.id;
  const isAdmin = user?.role === 'admin';

  const verify = async (id, verified) => {
    try { const r = await api(`/achievements/${id}/verify`, { method: 'PATCH', body: { verified } }); toast.success(r.message); reload(); } catch (e) { toast.error(e.message); }
  };

  return (
    <article className="space-y-6">
      <div className="card flex flex-col gap-6 p-6 sm:flex-row sm:items-center">
        <Avatar src={a.avatar} name={name} size="h-28 w-28 text-4xl" />
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="font-display text-3xl font-bold">{name}</h1>
            {a.isDemo && <DemoBadge />}
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            <span className="badge bg-brand/15 text-brand">{a.sport}</span>
            <span className="badge bg-muted/15 text-muted"><MapPin className="h-3 w-3" />{a.region}</span>
            <span className="badge bg-muted/15 text-muted">{a.age} yosh</span>
            <span className="badge bg-muted/15 text-muted">{a.experienceYears} yil tajriba</span>
          </div>
          {a.isMinor && !isOwner && !isAdmin && (
            <p className="mt-3 flex items-center gap-2 text-xs text-muted"><ShieldAlert className="h-4 w-4" />Voyaga yetmagan sportchi: aloqa ma'lumotlari himoyalangan.</p>
          )}
        </div>
        <div className="flex flex-col gap-2">
          {isOwner ? <Link href="/profilim" className="btn btn-primary">Profilni tahrirlash</Link> : (
            <>
              <Link href="/klublar" className="btn btn-primary">Klubga ariza yuborish</Link>
              <InviteButton athleteId={a._id} />
              <ReportButton targetType="athlete" targetId={a._id} />
            </>
          )}
        </div>
      </div>

      {(isOwner || isAdmin) && (a.phone || a.guardian?.name) && (
        <Block title="Maxfiy ma'lumotlar (faqat siz va administrator ko'radi)">
          <ul className="space-y-1 text-sm">
            {a.phone && <li>Telefon: {a.phone}</li>}
            {a.guardian?.name && <li>Ota-ona / vakil: {a.guardian.name} ({a.guardian.phone}), rozilik: {a.guardian.consent ? 'berilgan' : 'berilmagan'}</li>}
          </ul>
        </Block>
      )}

      <Block title="Sport tarjimayi holi">
        <p className="whitespace-pre-line text-sm">{a.bio || "Tarjimayi hol hali kiritilmagan."}</p>
        {a.bio && <div className="mt-3"><UserEntered /></div>}
      </Block>

      <Block title="Yutuqlar">
        {a.achievements?.length ? (
          <ul className="space-y-3">
            {a.achievements.map((x) => (
              <li key={x._id} className="flex flex-wrap items-start justify-between gap-3 rounded-xl border border-line bg-bg p-4">
                <div>
                  <p className="flex items-center gap-2 font-semibold"><Award className="h-4 w-4 text-accent" />{x.title}</p>
                  <p className="mt-1 text-xs text-muted">{levelLabel(x.level)} darajasi, {fmtDate(x.date)}</p>
                  {x.description && <p className="mt-1 text-sm">{x.description}</p>}
                </div>
                <div className="flex items-center gap-2">
                  {x.verified ? <Verified /> : <UserEntered />}
                  {isAdmin && <button className="btn btn-outline px-3 py-1.5" onClick={() => verify(x._id, !x.verified)}>{x.verified ? 'Tasdiqni bekor qilish' : 'Tasdiqlash'}</button>}
                </div>
              </li>
            ))}
          </ul>
        ) : <p className="text-sm text-muted">Yutuqlar hali qo'shilmagan.</p>}
      </Block>

      {a.competitionResults?.length > 0 && (
        <Block title="Musobaqa natijalari" note="Natijalar foydalanuvchi tomonidan kiritilgan va tekshirilmagan.">
          <ul className="space-y-2 text-sm">
            {a.competitionResults.map((r) => <li key={r._id} className="flex flex-wrap justify-between gap-2 border-b border-line pb-2"><span className="font-medium">{r.event}</span><span className="text-muted">{[r.place, r.result, r.date && fmtDate(r.date)].filter(Boolean).join(' · ')}</span></li>)}
          </ul>
        </Block>
      )}

      {a.trainingLog?.length > 0 && (
        <Block title="Mashg'ulot tarixi" note="Mashg'ulot yozuvlari foydalanuvchi tomonidan kiritilgan.">
          <ul className="space-y-2 text-sm">
            {a.trainingLog.map((r) => <li key={r._id} className="flex flex-wrap justify-between gap-2 border-b border-line pb-2"><span className="flex items-center gap-2"><Calendar className="h-4 w-4 text-muted" />{r.title}</span><span className="text-muted">{[r.result, r.date && fmtDate(r.date)].filter(Boolean).join(' · ')}</span></li>)}
          </ul>
        </Block>
      )}

      {a.media?.length > 0 && (
        <Block title="Video va rasmlar">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {a.media.map((m) => m.type === 'video'
              ? <video key={m._id} src={assetUrl(m.url)} controls preload="metadata" className="aspect-video w-full rounded-xl bg-black" />
              : <img key={m._id} src={assetUrl(m.url)} alt={m.caption || name} className="aspect-video w-full rounded-xl object-cover" />)}
          </div>
        </Block>
      )}

      {a.certificates?.length > 0 && (
        <Block title="Sertifikatlar">
          <ul className="space-y-2 text-sm">
            {a.certificates.map((c) => <li key={c._id} className="flex items-center justify-between gap-2"><span>{c.title}</span>{c.verified ? <Verified /> : <UserEntered />}</li>)}
          </ul>
        </Block>
      )}
    </article>
  );
}

export default function AthleteDetail() {
  return <DetailShell path="/athletes" back="/sportchilar" backLabel="Barcha sportchilar">{(a, reload) => <Profile a={a} reload={reload} />}</DetailShell>;
}
