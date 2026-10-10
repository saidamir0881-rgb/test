import './globals.css';
import { Manrope, Unbounded } from 'next/font/google';
import Providers from '@/components/Providers';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const body = Manrope({ subsets: ['latin', 'latin-ext', 'cyrillic'], variable: '--font-body', display: 'swap' });
const display = Unbounded({ subsets: ['latin', 'latin-ext', 'cyrillic'], variable: '--font-display', display: 'swap' });

export const metadata = {
  title: { default: 'TalentSport: yosh sportchilar uchun imkoniyatlar', template: '%s | TalentSport' },
  description: "Iqtidorni namoyish et, professional murabbiylar bilan bog'lan va sportdagi imkoniyatlaringni kashf et.",
};

const themeScript = `try{var t=localStorage.getItem('ts_theme');if(t!=='light')document.documentElement.classList.add('dark')}catch(e){document.documentElement.classList.add('dark')}`;

export default function RootLayout({ children }) {
  return (
    <html lang="uz" suppressHydrationWarning className={`${body.variable} ${display.variable}`}>
      <head><script dangerouslySetInnerHTML={{ __html: themeScript }} /></head>
      <body>
        <Providers>
          <Navbar />
          <main className="min-h-[70vh]">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
