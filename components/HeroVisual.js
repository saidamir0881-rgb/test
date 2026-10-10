import { Award, MapPin, Users } from 'lucide-react';

// Yugurish yo'laklari: sport mavzusidagi dekorativ tasvir. Raqamlar tashqaridan beriladi (haqiqiy statistika).
export default function HeroVisual({ stats }) {
  const items = [
    { icon: Users, label: 'Sportchilar', value: stats?.athletes },
    { icon: MapPin, label: 'Klublar', value: stats?.clubs },
    { icon: Award, label: 'Faol saralashlar', value: stats?.tryouts },
  ];
  return (
    <div className="relative mx-auto w-full max-w-lg">
      <svg viewBox="0 0 480 420" className="w-full" role="img" aria-label="Yugurish yo'laklari tasviri">
        <defs>
          <linearGradient id="g1" x1="0" x2="1"><stop offset="0" stopColor="rgb(var(--brand))" /><stop offset="1" stopColor="rgb(var(--accent))" /></linearGradient>
          <clipPath id="oval"><rect x="10" y="10" width="460" height="400" rx="200" /></clipPath>
        </defs>
        <rect x="10" y="10" width="460" height="400" rx="200" fill="rgb(var(--surface))" stroke="rgb(var(--line))" strokeWidth="2" />
        <g clipPath="url(#oval)" fill="none" strokeWidth="3">
          {[0, 1, 2, 3, 4].map((i) => (
            <rect key={i} className="lane" x={40 + i * 26} y={40 + i * 26} width={400 - i * 52} height={340 - i * 52} rx={170 - i * 26} stroke={i === 2 ? 'url(#g1)' : 'rgb(var(--line))'} />
          ))}
        </g>
        <circle cx="240" cy="210" r="46" fill="url(#g1)" />
        <path d="M222 214l12 12 24-28" stroke="#fff" strokeWidth="8" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <div className="absolute -bottom-4 left-0 right-0 mx-4 grid grid-cols-3 gap-2 sm:mx-8">
        {items.map(({ icon: Icon, label, value }) => (
          <div key={label} className="rounded-2xl border border-line bg-bg/95 p-3 text-center shadow-lg backdrop-blur">
            <Icon className="mx-auto h-4 w-4 text-accent" />
            <div className="font-display text-xl font-bold">{value ?? '–'}</div>
            <div className="text-[11px] text-muted">{label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
