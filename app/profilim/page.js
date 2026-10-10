'use client';
import { Suspense } from 'react';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Shield } from 'lucide-react';
import { useAuth } from '@/lib/auth';
import { roleLabel } from '@/lib/format';
import RequireRole from '@/components/RequireRole';
import { PageHeader, Spinner } from '@/components/ui';
import AthleteDashboard from '@/components/dashboard/AthleteDashboard';
import CoachDashboard from '@/components/dashboard/CoachDashboard';
import ClubDashboard from '@/components/dashboard/ClubDashboard';

function Dashboard() {
  const { user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const tab = params.get('tab') || 'profil';
  const setTab = (t) => router.replace(`${pathname}?tab=${t}`, { scroll: false });

  if (user.role === 'athlete') return <AthleteDashboard tab={tab} setTab={setTab} />;
  if (user.role === 'coach') return <CoachDashboard tab={tab} setTab={setTab} />;
  if (user.role === 'club') return <ClubDashboard tab={tab} setTab={setTab} />;
  return (
    <div className="card p-8 text-center">
      <Shield className="mx-auto h-10 w-10 text-brand" />
      <p className="mt-3">Administrator hisobi. Boshqaruv uchun admin panelga o'ting.</p>
      <Link href="/admin" className="btn btn-primary mt-4">Admin panel</Link>
    </div>
  );
}

export default function ProfilePage() {
  const { user } = useAuth();
  return (
    <>
      <PageHeader title="Profilim" text={user ? `${user.name} (${roleLabel(user.role)})` : undefined} />
      <div className="container-x max-w-4xl py-8">
        <RequireRole>
          <Suspense fallback={<div className="flex justify-center py-12"><Spinner className="h-8 w-8" /></div>}><Dashboard /></Suspense>
        </RequireRole>
      </div>
    </>
  );
}
