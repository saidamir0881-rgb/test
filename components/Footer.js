import Link from 'next/link';
import { Trophy } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="mt-24 border-t border-line bg-surface/50">
      <div className="container-x grid gap-8 py-12 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="flex items-center gap-2 font-display text-lg font-bold">
            <span className="rounded-lg bg-gradient-to-br from-brand to-accent p-1.5 text-white"><Trophy className="h-5 w-5" /></span>TalentSport
          </div>
          <p className="mt-3 max-w-sm text-sm text-muted">O'zbekiston yosh sportchilari, murabbiylar, sport klublari va homiylarni bog'laydigan platforma.</p>
          <p className="mt-3 max-w-sm text-xs text-muted">Platforma sportchini professional darajaga baholamaydi. U ma'lumotlar va imkoniyatlarni topishga yordam beradi.</p>
        </div>
        <div className="flex flex-col gap-2 text-sm">
          <span className="font-semibold">Bo'limlar</span>
          <Link href="/sportchilar" className="text-muted hover:text-ink">Sportchilar</Link>
          <Link href="/murabbiylar" className="text-muted hover:text-ink">Murabbiylar</Link>
          <Link href="/klublar" className="text-muted hover:text-ink">Sport klublari</Link>
        </div>
        <div className="flex flex-col gap-2 text-sm">
          <span className="font-semibold">Imkoniyatlar</span>
          <Link href="/saralashlar" className="text-muted hover:text-ink">Saralashlar</Link>
          <Link href="/stipendiyalar" className="text-muted hover:text-ink">Stipendiyalar</Link>
          <Link href="/imkoniyatlar" className="text-muted hover:text-ink">Imkoniyatlarni qidirish</Link>
        </div>
      </div>
      <div className="border-t border-line py-4 text-center text-xs text-muted">© {new Date().getFullYear()} TalentSport</div>
    </footer>
  );
}
