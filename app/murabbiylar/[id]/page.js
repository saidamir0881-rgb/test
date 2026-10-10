'use client';
import { MapPin } from 'lucide-react';
import DetailShell from '@/components/DetailShell';
import { ReportButton } from '@/components/ActionButtons';
import { Avatar } from '@/components/cards';

export default function CoachDetail() {
  return (
    <DetailShell path="/coaches" back="/murabbiylar" backLabel="Barcha murabbiylar">
      {(c) => (
        <article className="max-w-3xl space-y-6">
          <div className="flex items-center gap-5">
            <Avatar src={c.avatar} name={c.fullName} size="h-24 w-24 text-3xl" />
            <div>
              <h1 className="font-display text-3xl font-bold">{c.fullName}</h1>
              <p className="mt-1 flex items-center gap-1 text-muted"><MapPin className="h-4 w-4" />{c.region}</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <span className="badge bg-brand/15 text-brand">{c.sport}</span>
            <span className="badge bg-muted/15 text-muted">{c.experienceYears} yillik tajriba</span>
            {c.status !== 'approved' && <span className="badge bg-amber-500/15 text-amber-600">Tasdiqlanmagan</span>}
          </div>
          {c.bio && <p className="whitespace-pre-line">{c.bio}</p>}
          {c.certificates?.length > 0 && (
            <section>
              <h2 className="mb-2 font-display text-lg font-semibold">Sertifikatlar</h2>
              <ul className="list-inside list-disc text-sm">{c.certificates.map((x, i) => <li key={i}>{x.title}</li>)}</ul>
              <p className="mt-2 text-xs text-muted">Sertifikatlar foydalanuvchi tomonidan kiritilgan.</p>
            </section>
          )}
          <ReportButton targetType="coach" targetId={c._id} />
        </article>
      )}
    </DetailShell>
  );
}
