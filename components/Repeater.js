'use client';
import { Plus, Trash2 } from 'lucide-react';

// fields: [{ key, label, type: 'text' | 'date', placeholder }]
export default function Repeater({ items, onChange, fields, addLabel, empty }) {
  const update = (i, key, value) => onChange(items.map((it, idx) => (idx === i ? { ...it, [key]: value } : it)));
  const add = () => onChange([...items, Object.fromEntries(fields.map((f) => [f.key, '']))]);
  const remove = (i) => onChange(items.filter((_, idx) => idx !== i));
  return (
    <div className="space-y-3">
      {items.length === 0 && <p className="text-sm text-muted">{empty}</p>}
      {items.map((it, i) => (
        <div key={i} className="grid gap-2 rounded-xl border border-line bg-bg p-3 sm:grid-cols-[repeat(auto-fit,minmax(150px,1fr))_auto]">
          {fields.map((f) => (
            <input key={f.key} type={f.type || 'text'} className="input" aria-label={f.label} placeholder={f.label} value={f.type === 'date' ? (it[f.key] ? String(it[f.key]).slice(0, 10) : '') : it[f.key] ?? ''} onChange={(e) => update(i, f.key, e.target.value)} />
          ))}
          <button type="button" className="rounded-lg p-2 text-red-500 hover:bg-red-500/10" onClick={() => remove(i)} aria-label="O'chirish"><Trash2 className="h-4 w-4" /></button>
        </div>
      ))}
      <button type="button" className="btn btn-outline" onClick={add}><Plus className="h-4 w-4" />{addLabel}</button>
    </div>
  );
}
