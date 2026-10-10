'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Bell, CheckCheck } from 'lucide-react';
import RequireRole from '@/components/RequireRole';
import { useToast } from '@/components/Providers';
import { EmptyState, ErrorState, PageHeader, Pagination, Skeleton } from '@/components/ui';
import { api } from '@/lib/api';
import { useFetch } from '@/lib/useFetch';
import { fmtDate } from '@/lib/format';

function List() {
  const toast = useToast();
  const [page, setPage] = useState(1);
  const { data, pagination, extra, loading, error, reload } = useFetch('/notifications', { page, limit: 15 });

  const read = async (id) => { try { await api(`/notifications/${id}/read`, { method: 'PATCH' }); reload(); } catch (e) { toast.error(e.message); } };
  const readAll = async () => { try { const r = await api('/notifications/read-all', { method: 'PATCH' }); toast.success(r.message); reload(); } catch (e) { toast.error(e.message); } };

  if (loading) return <div className="space-y-3">{[0, 1, 2].map((i) => <Skeleton key={i} className="h-20" />)}</div>;
  if (error) return <ErrorState message={error} onRetry={reload} />;
  if (!data.length) return <EmptyState title="Bildirishnomalar yo'q" text="Arizalar, takliflar va tasdiqlashlar haqidagi xabarlar shu yerda ko'rinadi." />;
  return (
    <>
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-muted">O'qilmagan: {extra?.unread ?? 0}</p>
        <button className="btn btn-outline" onClick={readAll}><CheckCheck className="h-4 w-4" />Hammasini o'qilgan deb belgilash</button>
      </div>
      <ul className="space-y-3">
        {data.map((n) => (
          <li key={n._id} className={`card flex items-start gap-3 p-4 ${n.read ? '' : 'border-brand'}`}>
            <Bell className={`mt-1 h-5 w-5 ${n.read ? 'text-muted' : 'text-brand'}`} />
            <div className="flex-1">
              <p className="font-semibold">{n.title}</p>
              <p className="text-sm text-muted">{n.message}</p>
              <p className="mt-1 text-xs text-muted">{fmtDate(n.createdAt)}</p>
              {n.link && <Link href={n.link} className="mt-1 inline-block text-sm font-semibold text-brand" onClick={() => !n.read && read(n._id)}>Ko'rish</Link>}
            </div>
            {!n.read && <button className="text-xs font-semibold text-brand" onClick={() => read(n._id)}>O'qildi</button>}
          </li>
        ))}
      </ul>
      <Pagination pagination={pagination} onPage={setPage} />
    </>
  );
}

export default function NotificationsPage() {
  return (
    <>
      <PageHeader title="Bildirishnomalar" />
      <div className="container-x max-w-3xl py-8"><RequireRole><List /></RequireRole></div>
    </>
  );
}
