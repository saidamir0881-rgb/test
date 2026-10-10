'use client';
import Link from 'next/link';
import { useAuth } from '@/lib/auth';
import { Spinner } from './ui';

// roles ko'rsatilmasa, istalgan kirgan foydalanuvchi uchun. Haqiqiy himoya backendda.
export default function RequireRole({ roles, children }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="flex justify-center py-24"><Spinner className="h-8 w-8" /></div>;
  if (!user) {
    return (
      <div className="container-x py-24 text-center">
        <h1 className="font-display text-2xl font-bold">Davom etish uchun tizimga kiring</h1>
        <p className="mt-2 text-muted">Bu sahifa faqat ro'yxatdan o'tgan foydalanuvchilar uchun.</p>
        <div className="mt-6 flex justify-center gap-3">
          <Link href="/kirish" className="btn btn-primary">Kirish</Link>
          <Link href="/royxatdan-otish" className="btn btn-outline">Ro'yxatdan o'tish</Link>
        </div>
      </div>
    );
  }
  if (roles && !roles.includes(user.role)) {
    return (
      <div className="container-x py-24 text-center">
        <h1 className="font-display text-2xl font-bold">Bu sahifaga ruxsatingiz yo'q</h1>
        <p className="mt-2 text-muted">Hisobingiz roli bu bo'limga mos kelmaydi.</p>
        <Link href="/" className="btn btn-outline mt-6">Bosh sahifaga qaytish</Link>
      </div>
    );
  }
  return children;
}
