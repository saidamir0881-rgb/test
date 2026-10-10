'use client';
import Link from 'next/link';
import { Info, Lightbulb } from 'lucide-react';
import RequireRole from '@/components/RequireRole';
import { ClubCard, ScholarshipCard, TryoutCard } from '@/components/cards';
import { CardSkeletons, EmptyState, ErrorState, PageHeader } from '@/components/ui';
import { useFetch } from '@/lib/useFetch';
import { useAuth } from '@/lib/auth';

const LABEL = { tryout: 'Saralash', scholarship: 'Stipendiya', club: 'Klub' };

function Results() {
  const { profile } = useAuth();
  const { data, extra, loading, error, reload } = useFetch('/recommendations');
  if (loading) return <CardSkeletons />;
  if (error) return <ErrorState message={error} onRetry={reload} />;
  if (!data?.length) {
    return (
      <EmptyState title="Hozircha mos imkoniyat topilmadi" text="Profilingizdagi sport turi, hudud va yoshga mos faol e'lonlar chiqqanda shu yerda ko'rinadi."
        action={<Link href="/profilim" className="btn btn-primary">Profilni to'ldirish</Link>} />
    );
  }
  return (
    <>
      <p className="mb-6 flex items-start gap-2 rounded-xl border border-line bg-surface p-4 text-sm text-muted"><Info className="mt-0.5 h-4 w-4 shrink-0" />{extra?.disclaimer}</p>
      {profile && <p className="mb-4 text-sm text-muted">{profile.sport}, {profile.region}, {profile.age} yosh uchun natijalar</p>}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {data.map((r) => (
          <div key={`${r.type}-${r.item._id}`} className="flex flex-col gap-2">
            <div className="flex items-center justify-between text-xs">
              <span className="badge bg-brand/15 text-brand">{LABEL[r.type]}</span>
              <span className="font-semibold text-muted">Moslik: {r.score} ball</span>
            </div>
            {r.type === 'tryout' && <TryoutCard t={r.item} />}
            {r.type === 'scholarship' && <ScholarshipCard s={r.item} />}
            {r.type === 'club' && <ClubCard c={r.item} />}
            <ul className="card space-y-1 p-3 text-xs text-muted">
              <li className="flex items-center gap-1 font-semibold text-ink"><Lightbulb className="h-3.5 w-3.5 text-accent" />Nima uchun mos?</li>
              {r.reasons.map((x) => <li key={x}>• {x}</li>)}
            </ul>
          </div>
        ))}
      </div>
    </>
  );
}

export default function OpportunitiesPage() {
  return (
    <>
      <PageHeader title="Imkoniyatlarni qidirish" text="Sport turi, hudud, yosh va muddatingizga mos saralash, klub va stipendiyalar." />
      <div className="container-x py-8">
        <RequireRole roles={['athlete']}><Results /></RequireRole>
      </div>
    </>
  );
}
