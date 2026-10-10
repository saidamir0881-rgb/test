'use client';
import dynamic from 'next/dynamic';
import { Mail, MapPin, Phone, Send } from 'lucide-react';
import DetailShell from '@/components/DetailShell';
import { ApplyButton, ReportButton, SaveButton } from '@/components/ActionButtons';
import { Avatar } from '@/components/cards';
import { DemoBadge, Skeleton } from '@/components/ui';

const ClubMap = dynamic(() => import('@/components/ClubMap'), { ssr: false, loading: () => <Skeleton className="h-72" /> });

export default function ClubDetail() {
  return (
    <DetailShell path="/clubs" back="/klublar" backLabel="Barcha klublar">
      {(c) => (
        <article className="grid gap-8 lg:grid-cols-[1fr_340px]">
          <div className="space-y-6">
            <div className="flex items-center gap-5">
              <Avatar src={c.logo} name={c.name} size="h-24 w-24 text-3xl" />
              <div>
                <h1 className="font-display text-3xl font-bold">{c.name}</h1>
                <p className="mt-1 flex items-center gap-1 text-muted"><MapPin className="h-4 w-4" />{c.region}</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {c.sports.map((s) => <span key={s} className="badge bg-brand/15 text-brand">{s}</span>)}
              {c.isDemo && <DemoBadge />}
              {c.status !== 'approved' && <span className="badge bg-amber-500/15 text-amber-600">Tasdiqlanmagan</span>}
            </div>
            {c.description && <p className="whitespace-pre-line">{c.description}</p>}
            <section><h2 className="mb-2 font-display text-lg font-semibold">Qabul talablari</h2><p className="whitespace-pre-line text-sm">{c.requirements || "Talablar ko'rsatilmagan"}</p></section>
            <section>
              <h2 className="mb-2 font-display text-lg font-semibold">Mashg'ulot manzili</h2>
              <p className="mb-3 text-sm">{c.address || "Manzil ko'rsatilmagan"}</p>
              {c.location?.lat != null && c.location?.lng != null && <ClubMap lat={c.location.lat} lng={c.location.lng} label={c.name} />}
            </section>
          </div>
          <aside className="card h-fit space-y-4 p-6">
            <h2 className="font-display font-semibold">Aloqa</h2>
            <ul className="space-y-2 text-sm">
              {c.contact?.phone && <li className="flex gap-2"><Phone className="h-4 w-4 text-muted" />{c.contact.phone}</li>}
              {c.contact?.email && <li className="flex gap-2"><Mail className="h-4 w-4 text-muted" />{c.contact.email}</li>}
              {c.contact?.telegram && <li className="flex gap-2"><Send className="h-4 w-4 text-muted" />{c.contact.telegram}</li>}
              {!c.contact?.phone && !c.contact?.email && !c.contact?.telegram && <li className="text-muted">Aloqa ma'lumoti kiritilmagan</li>}
            </ul>
            <div className="flex flex-col gap-2">
              {c.status === 'approved' && <ApplyButton targetType="club" targetId={c._id} title={c.name} />}
              <SaveButton targetType="club" id={c._id} />
              <ReportButton targetType="club" targetId={c._id} />
            </div>
          </aside>
        </article>
      )}
    </DetailShell>
  );
}
