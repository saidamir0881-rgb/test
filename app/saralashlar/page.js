'use client';
import CatalogPage from '@/components/CatalogPage';
import { TryoutCard } from '@/components/cards';
import { REGIONS, SPORTS } from '@/lib/constants';

const cfg = {
  title: 'Saralashlar',
  text: "Faqat ro'yxatdan o'tish muddati tugamagan, tasdiqlangan saralashlar ko'rsatiladi.",
  path: '/tryouts',
  fields: [
    { key: 'q', label: 'Tadbir nomi', placeholder: 'Nomi bo\'yicha qidirish' },
    { key: 'sport', label: 'Sport turi', type: 'select', options: SPORTS },
    { key: 'region', label: 'Hudud', type: 'select', options: REGIONS },
    { key: 'age', label: 'Mening yoshim', type: 'number' },
  ],
  render: (t) => <TryoutCard key={t._id} t={t} />,
  emptyTitle: 'Faol saralash topilmadi',
};

export default function Page() { return <CatalogPage cfg={cfg} />; }
