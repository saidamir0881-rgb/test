'use client';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { useFetch } from '@/lib/useFetch';
import { ErrorState, Skeleton } from './ui';

// Yuklanish va xatolik holatlarini bitta joyda boshqaradi
export default function DetailShell({ path, back, backLabel, children }) {
  const { id } = useParams();
  const { data, loading, error, reload } = useFetch(`${path}/${id}`);
  return (
    <div className="container-x py-8">
      <Link href={back} className="mb-6 inline-flex items-center gap-1 text-sm text-muted hover:text-ink"><ArrowLeft className="h-4 w-4" />{backLabel}</Link>
      {loading ? <div className="space-y-4"><Skeleton className="h-40" /><Skeleton className="h-64" /></div>
        : error ? <ErrorState message={error} onRetry={reload} />
        : children(data, reload)}
    </div>
  );
}
