'use client';
import { Calendar, Clock, ExternalLink, MapPin, Users } from 'lucide-react';
import DetailShell from '@/components/DetailShell';
import { ApplyButton, ReportButton, SaveButton } from '@/components/ActionButtons';
import { DemoBadge } from '@/components/ui';
import { fmtDate } from '@/lib/format';

export default function TryoutDetail() {
  return (
    <DetailShell path="/tryouts" back="/saralashlar" backLabel="Barcha saralashlar">
      {(t) => (
        <article className="grid gap-8 lg:grid-cols-[1fr_320px]">
          <div className="space-y-6">
            <div className="flex flex-wrap gap-2">
              <span className="badge bg-brand/15 text-brand">{t.sport}</span>
              {t.isDemo && <DemoBadge />}
              {t.expired && <span className="badge bg-red-500/15 text-red-500">Muddati tugagan</span>}
              {t.status !== 'approved' && <span className="badge bg-amber-500/15 text-amber-600">Tasdiqlanmagan</span>}
            </div>
            <h1 className="font-display text-3xl font-bold">{t.title}</h1>
            <p className="text-muted">Tashkilotchi: {t.organization}</p>
            {t.description && <p className="whitespace-pre-line">{t.description}</p>}
            {t.requirements && <section><h2 className="mb-2 font-display text-lg font-semibold">Talablar</h2><p className="whitespace-pre-line text-sm">{t.requirements}</p></section>}
            {t.link && <a href={t.link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-sm font-semibold text-brand"><ExternalLink className="h-4 w-4" />Qo'shimcha ma'lumot</a>}
          </div>
          <aside className="card h-fit space-y-4 p-6">
            <ul className="space-y-3 text-sm">
              <li className="flex gap-2"><Calendar className="h-4 w-4 shrink-0 text-muted" />Sana: {fmtDate(t.date)}</li>
              <li className="flex gap-2"><MapPin className="h-4 w-4 shrink-0 text-muted" />{t.address}</li>
              <li className="flex gap-2"><Clock className="h-4 w-4 shrink-0 text-muted" />Ariza muddati: {fmtDate(t.deadline)}</li>
              <li className="flex gap-2"><Users className="h-4 w-4 shrink-0 text-muted" />Yosh: {t.minAge}-{t.maxAge}</li>
            </ul>
            <div className="flex flex-col gap-2">
              {!t.expired && t.status === 'approved' && <ApplyButton targetType="tryout" targetId={t._id} title={t.title} />}
              <SaveButton targetType="tryout" id={t._id} />
              <ReportButton targetType="tryout" targetId={t._id} />
            </div>
          </aside>
        </article>
      )}
    </DetailShell>
  );
}
