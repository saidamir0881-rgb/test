'use client';
import { Clock, ExternalLink, MapPin, Trophy, Users } from 'lucide-react';
import DetailShell from '@/components/DetailShell';
import { ApplyButton, ReportButton, SaveButton } from '@/components/ActionButtons';
import { DemoBadge } from '@/components/ui';
import { fmtDate, typeLabel } from '@/lib/format';

export default function ScholarshipDetail() {
  return (
    <DetailShell path="/scholarships" back="/stipendiyalar" backLabel="Barcha stipendiyalar">
      {(s) => (
        <article className="grid gap-8 lg:grid-cols-[1fr_320px]">
          <div className="space-y-6">
            <div className="flex flex-wrap gap-2">
              <span className="badge bg-accent/15 text-accent">{typeLabel(s.type)}</span>
              {s.isDemo && <DemoBadge />}
              {s.expired && <span className="badge bg-red-500/15 text-red-500">Muddati tugagan</span>}
              {s.status !== 'approved' && <span className="badge bg-amber-500/15 text-amber-600">Tasdiqlanmagan</span>}
            </div>
            <h1 className="font-display text-3xl font-bold">{s.title}</h1>
            <p className="text-muted">Mas'ul tashkilot: {s.organization}</p>
            {s.isDemo && <p className="rounded-xl bg-amber-500/10 p-3 text-sm">Bu namunaviy (demo) e'lon. Haqiqiy moliyaviy imkoniyat sifatida qaramang.</p>}
            {s.description && <p className="whitespace-pre-line">{s.description}</p>}
            <section><h2 className="mb-2 font-display text-lg font-semibold">Talablar</h2><p className="whitespace-pre-line text-sm">{s.requirements}</p></section>
            {s.link && <a href={s.link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-sm font-semibold text-brand"><ExternalLink className="h-4 w-4" />Qo'shimcha ma'lumot</a>}
          </div>
          <aside className="card h-fit space-y-4 p-6">
            <ul className="space-y-3 text-sm">
              <li className="flex gap-2"><Trophy className="h-4 w-4 shrink-0 text-muted" />{s.sport}</li>
              <li className="flex gap-2"><MapPin className="h-4 w-4 shrink-0 text-muted" />{s.region}</li>
              <li className="flex gap-2"><Clock className="h-4 w-4 shrink-0 text-muted" />Muddat: {fmtDate(s.deadline)}</li>
              <li className="flex gap-2"><Users className="h-4 w-4 shrink-0 text-muted" />Yosh: {s.minAge}-{s.maxAge}</li>
            </ul>
            <div className="flex flex-col gap-2">
              {!s.expired && s.status === 'approved' && <ApplyButton targetType="scholarship" targetId={s._id} title={s.title} />}
              <SaveButton targetType="scholarship" id={s._id} />
              <ReportButton targetType="scholarship" targetId={s._id} />
            </div>
          </aside>
        </article>
      )}
    </DetailShell>
  );
}
