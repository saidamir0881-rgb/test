'use client';
import CatalogPage from '@/components/CatalogPage';
import { ClubCard } from '@/components/cards';
import { REGIONS, SPORTS } from '@/lib/constants';

const cfg = {
  title: 'Sport klublari',
  text: 'Qabul talablari, manzil va aloqa ma\'lumotlari bilan tasdiqlangan klublar.',
  path: '/clubs',
  fields: [
    { key: 'q', label: 'Klub nomi', placeholder: 'Nomi bo\'yicha qidirish' },
    { key: 'sport', label: 'Sport turi', type: 'select', options: SPORTS },
    { key: 'region', label: 'Hudud', type: 'select', options: REGIONS },
  ],
  render: (c) => <ClubCard key={c._id} c={c} />,
  emptyTitle: 'Klublar topilmadi',
};

export default function Page() { return <CatalogPage cfg={cfg} />; }
