'use client';
import CatalogPage from '@/components/CatalogPage';
import { ScholarshipCard } from '@/components/cards';
import { REGIONS, SPORTS } from '@/lib/constants';

const cfg = {
  title: 'Stipendiyalar va moliyaviy yordam',
  text: "Sport jihozlari, mashg'ulot xarajatlari, lagerlar va homiylik dasturlari. Tasdiqlanmagan e'lonlar ko'rsatilmaydi.",
  path: '/scholarships',
  fields: [
    { key: 'q', label: 'Nomi', placeholder: 'Nomi bo\'yicha qidirish' },
    { key: 'sport', label: 'Sport turi', type: 'select', options: SPORTS },
    { key: 'region', label: 'Hudud', type: 'select', options: REGIONS },
    { key: 'age', label: 'Mening yoshim', type: 'number' },
  ],
  render: (s) => <ScholarshipCard key={s._id} s={s} />,
  emptyTitle: "Faol e'lon topilmadi",
};

export default function Page() { return <CatalogPage cfg={cfg} />; }
