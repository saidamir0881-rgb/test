'use client';
import Link from 'next/link';
import { ArrowRight, Handshake, Search, UserPlus } from 'lucide-react';
import { useFetch } from '@/lib/useFetch';
import { SPORTS } from '@/lib/constants';
import HeroVisual from '@/components/HeroVisual';
import { AthleteCard, ClubCard, ScholarshipCard, TryoutCard } from '@/components/cards';
import { CardSkeletons, EmptyState, ErrorState } from '@/components/ui';

function Section({ title, text, href, linkLabel, children }) {
  return (
    <section className="container-x mt-20">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="font-display text-2xl font-bold sm:text-3xl">{title}</h2>
          {text && <p className="mt-1 text-muted">{text}</p>}
        </div>
        {href && <Link href={href} className="inline-flex items-center gap-1 text-sm font-semibold text-brand hover:underline">{linkLabel}<ArrowRight className="h-4 w-4" /></Link>}
      </div>
      {children}
    </section>
  );
}

function Feed({ path, query, render, emptyTitle, emptyText }) {
  const { data, loading, error, reload } = useFetch(path, query);
  if (loading) return <CardSkeletons count={3} />;
  if (error) return <ErrorState message={error} onRetry={reload} />;
  if (!data?.length) return <EmptyState title={emptyTitle} text={emptyText} />;
  return <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{data.map(render)}</div>;
}

const STEPS = [
  { icon: UserPlus, title: "Profil yarat", text: "Sport turi, hudud, yosh va yutuqlaringni kiritib profil ochasan." },
  { icon: Search, title: 'Imkoniyat top', text: "Saralash, klub va stipendiyalar orasidan o'zingga mosini filtrlaysan." },
  { icon: Handshake, title: "Ariza yubor", text: "Klublarga ariza yuborasan, murabbiylar esa seni saralashga taklif qiladi." },
];

const STORIES = [
  { name: 'Namuna hikoya 1', text: "Viloyat musobaqasidan keyin profil yaratgan sportchi mahalliy klubdan saralashga taklif oldi." },
  { name: 'Namuna hikoya 2', text: "Murabbiy platforma orqali boshqa tumandagi iqtidorli yosh futbolchini topdi." },
  { name: 'Namuna hikoya 3', text: "Yosh kurashchi sport jihozlari uchun yordam dasturiga ariza yubordi." },
];

export default function Home() {
  const { data: stats } = useFetch('/stats');
  return (
    <>
      <section className="relative overflow-hidden border-b border-line">
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-brand/15 via-transparent to-accent/10" />
        <div className="container-x grid items-center gap-14 py-16 lg:grid-cols-2 lg:py-24">
          <div>
            <h1 className="font-display text-4xl font-bold leading-tight sm:text-5xl">Kelajagingni sport bilan yarat!</h1>
            <p className="mt-5 max-w-xl text-lg text-muted">Iqtidorni namoyish et, professional murabbiylar bilan bog'lan va sportdagi imkoniyatlaringni kashf et.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/royxatdan-otish" className="btn btn-primary px-6 py-3">Sportchi bo'lib qo'shilish</Link>
              <Link href="/sportchilar" className="btn btn-outline px-6 py-3">Iqtidorlarni kashf etish</Link>
            </div>
            {stats?.includesDemoData && <p className="mt-5 text-xs text-muted">Statistika bazadagi ma'lumotlardan hisoblanadi. Ba'zi yozuvlar namuna (demo) sifatida belgilangan.</p>}
          </div>
          <div className="pb-6"><HeroVisual stats={stats} /></div>
        </div>
      </section>

      <Section title="Platforma qanday ishlaydi?">
        <ol className="grid gap-5 md:grid-cols-3">
          {STEPS.map(({ icon: Icon, title, text }, i) => (
            <li key={title} className="card flex gap-4 p-6">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand/15 text-brand"><Icon className="h-6 w-6" /></div>
              <div><h3 className="font-display font-semibold">{i + 1}. {title}</h3><p className="mt-1 text-sm text-muted">{text}</p></div>
            </li>
          ))}
        </ol>
      </Section>

      <Section title="Yangi sportchilar" href="/sportchilar" linkLabel="Barchasi">
        <Feed path="/athletes" query={{ limit: 3 }} render={(a) => <AthleteCard key={a._id} a={a} />} emptyTitle="Hozircha sportchilar yo'q" emptyText="Birinchi bo'lib profil yarating." />
      </Section>
      <Section title="Tavsiya etilgan klublar" href="/klublar" linkLabel="Barcha klublar">
        <Feed path="/clubs" query={{ limit: 3 }} render={(c) => <ClubCard key={c._id} c={c} />} emptyTitle="Tasdiqlangan klublar hali yo'q" />
      </Section>
      <Section title="Yaqinlashayotgan saralashlar" href="/saralashlar" linkLabel="Barcha saralashlar">
        <Feed path="/tryouts" query={{ limit: 3 }} render={(t) => <TryoutCard key={t._id} t={t} />} emptyTitle="Faol saralash yo'q" emptyText="Yangi e'lonlar chiqqanda shu yerda ko'rinadi." />
      </Section>
      <Section title="Stipendiya imkoniyatlari" href="/stipendiyalar" linkLabel="Barcha imkoniyatlar">
        <Feed path="/scholarships" query={{ limit: 3 }} render={(s) => <ScholarshipCard key={s._id} s={s} />} emptyTitle="Faol stipendiya e'lonlari yo'q" />
      </Section>

      <Section title="Sport yo'nalishlari">
        <div className="flex flex-wrap gap-2">
          {SPORTS.map((s) => <Link key={s} href={`/sportchilar?sport=${encodeURIComponent(s)}`} className="rounded-full border border-line bg-surface px-4 py-2 text-sm font-medium transition hover:border-brand hover:text-brand">{s}</Link>)}
        </div>
      </Section>

      <Section title="Muvaffaqiyat hikoyalari" text="Quyidagi hikoyalar namuna sifatida berilgan, haqiqiy foydalanuvchilar hikoyasi emas.">
        <div className="grid gap-5 md:grid-cols-3">
          {STORIES.map((s) => (
            <figure key={s.name} className="card p-6">
              <span className="badge bg-amber-500/15 text-amber-600 dark:text-amber-400">Namuna</span>
              <blockquote className="mt-3 text-sm">{s.text}</blockquote>
              <figcaption className="mt-3 text-xs text-muted">{s.name}</figcaption>
            </figure>
          ))}
        </div>
      </Section>

      <section className="container-x mt-20">
        <div className="rounded-3xl bg-gradient-to-br from-brand to-accent p-10 text-center text-white sm:p-14">
          <h2 className="font-display text-2xl font-bold sm:text-3xl">Platformaga qo'shil</h2>
          <p className="mx-auto mt-3 max-w-xl text-white/90">Sportchi, murabbiy yoki klub sifatida ro'yxatdan o'ting va imkoniyatlarni birga toping.</p>
          <Link href="/royxatdan-otish" className="btn mt-6 bg-white px-6 py-3 text-navy hover:bg-white/90">Ro'yxatdan o'tish</Link>
        </div>
      </section>
    </>
  );
}
