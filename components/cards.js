import Link from 'next/link';
import { Award, Calendar, Clock, MapPin, Timer, Trophy } from 'lucide-react';
import { assetUrl } from '@/lib/api';
import { daysLeft, fmtDate, initials, typeLabel } from '@/lib/format';
import { DemoBadge } from './ui';

export function Avatar({ src, name, size = 'h-16 w-16 text-xl' }) {
  return src ? (
    <img src={assetUrl(src)} alt={name} className={`${size} rounded-2xl object-cover`} />
  ) : (
    <div className={`${size} flex items-center justify-center rounded-2xl bg-gradient-to-br from-brand to-accent font-display font-bold text-white`} aria-hidden="true">{initials(name)}</div>
  );
}

export function AthleteCard({ a }) {
  const name = `${a.firstName} ${a.lastName}`;
  return (
    <article className="card flex flex-col gap-4 p-5 transition hover:border-brand">
      <div className="flex items-center gap-4">
        <Avatar src={a.avatar} name={name} />
        <div className="min-w-0">
          <h3 className="truncate font-display text-lg font-semibold">{name}</h3>
          <p className="text-sm text-muted">{a.age} yosh</p>
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        <span className="badge bg-brand/15 text-brand">{a.sport}</span>
        <span className="badge bg-muted/15 text-muted"><MapPin className="h-3 w-3" />{a.region}</span>
        {a.isDemo && <DemoBadge />}
      </div>
      <dl className="grid grid-cols-2 gap-3 text-sm">
        <div><dt className="text-muted">Tajriba</dt><dd className="font-semibold">{a.experienceYears} yil</dd></div>
        <div><dt className="text-muted">Yutuqlar</dt><dd className="flex items-center gap-1 font-semibold"><Award className="h-4 w-4 text-accent" />{a.achievementsCount}</dd></div>
      </dl>
      <Link href={`/sportchilar/${a._id}`} className="btn btn-outline mt-auto">Profilni ko'rish</Link>
    </article>
  );
}

export function ClubCard({ c }) {
  return (
    <article className="card flex flex-col gap-3 p-5 transition hover:border-brand">
      <div className="flex items-center gap-4">
        <Avatar src={c.logo} name={c.name} />
        <div className="min-w-0">
          <h3 className="font-display text-lg font-semibold leading-tight">{c.name}</h3>
          <p className="flex items-center gap-1 text-sm text-muted"><MapPin className="h-3.5 w-3.5" />{c.region}</p>
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        {c.sports.map((s) => <span key={s} className="badge bg-brand/15 text-brand">{s}</span>)}
        {c.isDemo && <DemoBadge />}
      </div>
      {c.address && <p className="text-sm text-muted">{c.address}</p>}
      <Link href={`/klublar/${c._id}`} className="btn btn-outline mt-auto">Batafsil</Link>
    </article>
  );
}

export function CoachCard({ c }) {
  return (
    <article className="card flex flex-col gap-3 p-5 transition hover:border-brand">
      <div className="flex items-center gap-4">
        <Avatar src={c.avatar} name={c.fullName} />
        <div className="min-w-0">
          <h3 className="font-display text-lg font-semibold leading-tight">{c.fullName}</h3>
          <p className="text-sm text-muted">{c.experienceYears} yillik tajriba</p>
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        <span className="badge bg-brand/15 text-brand">{c.sport}</span>
        <span className="badge bg-muted/15 text-muted"><MapPin className="h-3 w-3" />{c.region}</span>
      </div>
      <Link href={`/murabbiylar/${c._id}`} className="btn btn-outline mt-auto">Profilni ko'rish</Link>
    </article>
  );
}

export function TryoutCard({ t }) {
  const left = daysLeft(t.deadline);
  return (
    <article className="card flex flex-col gap-3 p-5 transition hover:border-brand">
      <div className="flex flex-wrap gap-2">
        <span className="badge bg-brand/15 text-brand">{t.sport}</span>
        {t.isDemo && <DemoBadge />}
        {left <= 7 && <span className="badge bg-red-500/15 text-red-500"><Timer className="h-3 w-3" />{left <= 0 ? 'Bugun tugaydi' : `${left} kun qoldi`}</span>}
      </div>
      <h3 className="font-display text-lg font-semibold leading-tight">{t.title}</h3>
      <p className="text-sm text-muted">{t.organization}</p>
      <ul className="space-y-1.5 text-sm">
        <li className="flex items-center gap-2"><Calendar className="h-4 w-4 text-muted" />{fmtDate(t.date)}</li>
        <li className="flex items-center gap-2"><MapPin className="h-4 w-4 text-muted" />{t.address}</li>
        <li className="flex items-center gap-2"><Clock className="h-4 w-4 text-muted" />Ariza muddati: {fmtDate(t.deadline)}</li>
      </ul>
      <p className="text-xs text-muted">Yosh: {t.minAge}-{t.maxAge}</p>
      <Link href={`/saralashlar/${t._id}`} className="btn btn-outline mt-auto">Batafsil</Link>
    </article>
  );
}

export function ScholarshipCard({ s }) {
  return (
    <article className="card flex flex-col gap-3 p-5 transition hover:border-brand">
      <div className="flex flex-wrap gap-2">
        <span className="badge bg-accent/15 text-accent">{typeLabel(s.type)}</span>
        {s.isDemo && <DemoBadge />}
      </div>
      <h3 className="font-display text-lg font-semibold leading-tight">{s.title}</h3>
      <p className="text-sm text-muted">Mas'ul tashkilot: {s.organization}</p>
      <ul className="space-y-1.5 text-sm">
        <li className="flex items-center gap-2"><Trophy className="h-4 w-4 text-muted" />{s.sport}</li>
        <li className="flex items-center gap-2"><MapPin className="h-4 w-4 text-muted" />{s.region}</li>
        <li className="flex items-center gap-2"><Clock className="h-4 w-4 text-muted" />Muddat: {fmtDate(s.deadline)}</li>
      </ul>
      <Link href={`/stipendiyalar/${s._id}`} className="btn btn-outline mt-auto">Batafsil</Link>
    </article>
  );
}
