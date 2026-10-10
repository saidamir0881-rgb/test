'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Bell, LogOut, Menu, Moon, Sun, Trophy, User, X } from 'lucide-react';
import { useAuth } from '@/lib/auth';
import { api } from '@/lib/api';
import { useTheme } from './Providers';

const LINKS = [
  ['/', 'Bosh sahifa'], ['/sportchilar', 'Sportchilar'], ['/murabbiylar', 'Murabbiylar'],
  ['/klublar', 'Sport klublari'], ['/saralashlar', 'Saralashlar'], ['/stipendiyalar', 'Stipendiyalar'],
];

export default function Navbar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const { theme, toggle } = useTheme();
  const [open, setOpen] = useState(false);
  const [unread, setUnread] = useState(0);

  useEffect(() => { setOpen(false); }, [pathname]);
  useEffect(() => {
    if (!user) { setUnread(0); return; }
    api('/notifications', { query: { limit: 1 } }).then((r) => setUnread(r.unread || 0)).catch(() => {});
  }, [user, pathname]);

  const active = (href) => (href === '/' ? pathname === '/' : pathname.startsWith(href));

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-bg/85 backdrop-blur">
      <div className="container-x flex h-16 items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2 font-display text-lg font-bold">
          <span className="rounded-lg bg-gradient-to-br from-brand to-accent p-1.5 text-white"><Trophy className="h-5 w-5" /></span>
          TalentSport
        </Link>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Asosiy menyu">
          {LINKS.map(([href, label]) => (
            <Link key={href} href={href} className={`rounded-lg px-3 py-2 text-sm font-medium transition hover:bg-surface ${active(href) ? 'text-brand' : 'text-muted'}`}>{label}</Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <button onClick={toggle} className="rounded-lg p-2 hover:bg-surface" aria-label={theme === 'dark' ? "Yorug' rejim" : "Qorong'i rejim"}>
            {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>
          {user ? (
            <>
              <Link href="/bildirishnomalar" className="relative rounded-lg p-2 hover:bg-surface" aria-label="Bildirishnomalar">
                <Bell className="h-5 w-5" />
                {unread > 0 && <span className="absolute right-0.5 top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-accent px-1 text-[10px] font-bold text-navy">{unread}</span>}
              </Link>
              {user.role === 'athlete' && <Link href="/imkoniyatlar" className="btn btn-accent hidden md:inline-flex">Imkoniyatlar</Link>}
              {['club', 'coach', 'admin'].includes(user.role) && <Link href="/elon-joylash" className="btn btn-accent hidden md:inline-flex">E'lon joylash</Link>}
              {user.role === 'admin' && <Link href="/admin" className="btn btn-outline hidden md:inline-flex">Admin</Link>}
              <Link href="/profilim" className="btn btn-outline hidden sm:inline-flex"><User className="h-4 w-4" />Profilim</Link>
              <button onClick={logout} className="btn btn-outline hidden sm:inline-flex" aria-label="Chiqish"><LogOut className="h-4 w-4" /></button>
            </>
          ) : (
            <>
              <Link href="/kirish" className="btn btn-outline hidden sm:inline-flex">Kirish</Link>
              <Link href="/royxatdan-otish" className="btn btn-primary hidden sm:inline-flex">Ro'yxatdan o'tish</Link>
            </>
          )}
          <button onClick={() => setOpen(!open)} className="rounded-lg p-2 hover:bg-surface lg:hidden" aria-label="Menyu" aria-expanded={open}>
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-line bg-bg lg:hidden">
          <div className="container-x flex flex-col gap-1 py-3">
            {LINKS.map(([href, label]) => <Link key={href} href={href} className={`rounded-lg px-3 py-2.5 text-sm font-medium ${active(href) ? 'bg-surface text-brand' : ''}`}>{label}</Link>)}
            <Link href="/imkoniyatlar" className="rounded-lg px-3 py-2.5 text-sm font-medium">Imkoniyatlarni qidirish</Link>
            {user ? (
              <>
                <Link href="/profilim" className="rounded-lg px-3 py-2.5 text-sm font-medium">Profilim</Link>
                {['club', 'coach', 'admin'].includes(user.role) && <Link href="/elon-joylash" className="rounded-lg px-3 py-2.5 text-sm font-medium">E'lon joylash</Link>}
                {user.role === 'admin' && <Link href="/admin" className="rounded-lg px-3 py-2.5 text-sm font-medium">Admin panel</Link>}
                <button onClick={logout} className="rounded-lg px-3 py-2.5 text-left text-sm font-medium">Chiqish</button>
              </>
            ) : (
              <div className="mt-2 flex gap-2">
                <Link href="/kirish" className="btn btn-outline flex-1">Kirish</Link>
                <Link href="/royxatdan-otish" className="btn btn-primary flex-1">Ro'yxatdan o'tish</Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
