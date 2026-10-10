'use client';
import { useRef, useState } from 'react';
import { Upload } from 'lucide-react';
import { uploadFile } from '@/lib/api';
import { useToast } from './Providers';
import { Spinner } from './ui';

export default function ImageUpload({ onUploaded, accept = 'image/jpeg,image/png,image/webp', label = 'Rasm yuklash' }) {
  const ref = useRef(null);
  const toast = useToast();
  const [busy, setBusy] = useState(false);
  const pick = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) return toast.error('Fayl hajmi 10 MB dan oshmasligi kerak');
    setBusy(true);
    try { onUploaded(await uploadFile(file)); toast.success('Fayl yuklandi'); } catch (err) { toast.error(err.message); } finally { setBusy(false); }
  };
  return (
    <>
      <input ref={ref} type="file" accept={accept} className="hidden" onChange={pick} />
      <button type="button" className="btn btn-outline" onClick={() => ref.current?.click()} disabled={busy}>
        {busy ? <Spinner className="h-4 w-4" /> : <Upload className="h-4 w-4" />}{label}
      </button>
    </>
  );
}
