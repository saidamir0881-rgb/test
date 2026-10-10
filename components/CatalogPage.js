'use client';
import { Suspense, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Search } from 'lucide-react';
import { useFetch } from '@/lib/useFetch';
import { CardSkeletons, EmptyState, ErrorState, Field, PageHeader, Pagination, Select } from './ui';

// cfg: { title, text, path, fields: [{key,label,type,options,placeholder}], render(item), emptyTitle, emptyText, action }
function Inner({ cfg }) {
  const sp = useSearchParams();
  const initial = Object.fromEntries(cfg.fields.map((f) => [f.key, sp.get(f.key) || '']));
  const [draft, setDraft] = useState(initial);
  const [applied, setApplied] = useState(initial);
  const [page, setPage] = useState(1);
  const { data, pagination, loading, error, reload } = useFetch(cfg.path, { ...applied, page, limit: 12 });

  const apply = (e) => { e.preventDefault(); setApplied(draft); setPage(1); };
  const reset = () => { const empty = Object.fromEntries(cfg.fields.map((f) => [f.key, ''])); setDraft(empty); setApplied(empty); setPage(1); };

  return (
    <>
      <PageHeader title={cfg.title} text={cfg.text}>{cfg.action}</PageHeader>
      <div className="container-x py-8">
        <form onSubmit={apply} className="card mb-8 grid gap-4 p-5 sm:grid-cols-2 lg:grid-cols-4">
          {cfg.fields.map((f) => (
            <Field key={f.key} label={f.label}>
              {f.type === 'select' ? (
                <Select value={draft[f.key]} onChange={(v) => setDraft({ ...draft, [f.key]: v })} options={f.options} placeholder="Barchasi" />
              ) : f.type === 'check' ? (
                <span className="flex h-[42px] items-center gap-2 text-sm">
                  <input type="checkbox" checked={draft[f.key] === 'true'} onChange={(e) => setDraft({ ...draft, [f.key]: e.target.checked ? 'true' : '' })} />Faqat yutuqlari borlar
                </span>
              ) : (
                <input type={f.type || 'text'} min={f.type === 'number' ? 0 : undefined} className="input" placeholder={f.placeholder} value={draft[f.key]} onChange={(e) => setDraft({ ...draft, [f.key]: e.target.value })} />
              )}
            </Field>
          ))}
          <div className="flex items-end gap-2 lg:col-span-4 lg:justify-end">
            <button type="button" className="btn btn-outline" onClick={reset}>Tozalash</button>
            <button className="btn btn-primary"><Search className="h-4 w-4" />Qidirish</button>
          </div>
        </form>

        {loading ? <CardSkeletons /> : error ? <ErrorState message={error} onRetry={reload} /> : !data?.length ? (
          <EmptyState title={cfg.emptyTitle || "Hech narsa topilmadi"} text={cfg.emptyText || "Filtrlarni o'zgartirib qayta urinib ko'ring."} />
        ) : (
          <>
            <p className="mb-4 text-sm text-muted">Jami natija: {pagination?.total ?? data.length}</p>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{data.map(cfg.render)}</div>
            <Pagination pagination={pagination} onPage={setPage} />
          </>
        )}
      </div>
    </>
  );
}

export default function CatalogPage({ cfg }) {
  return <Suspense fallback={<div className="container-x py-12"><CardSkeletons /></div>}><Inner cfg={cfg} /></Suspense>;
}
