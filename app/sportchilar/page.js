'use client';
import CatalogPage from '@/components/CatalogPage';
import { AthleteCard } from '@/components/cards';
import { REGIONS, SPORTS } from '@/lib/constants';

const cfg = {
  title: 'Sportchilar',
  text: "O'zbekiston yosh sportchilari katalogi. Sport turi, hudud, yosh va tajriba bo'yicha qidiring.",
  path: '/athletes',
  fields: [
    { key: 'q', label: 'Ism bo\'yicha', placeholder: 'Ism yoki familiya' },
    { key: 'sport', label: 'Sport turi', type: 'select', options: SPORTS },
    { key: 'region', label: 'Hudud', type: 'select', options: REGIONS },
    { key: 'minAge', label: 'Yoshi (dan)', type: 'number' },
    { key: 'maxAge', label: 'Yoshi (gacha)', type: 'number' },
    { key: 'minExperience', label: 'Tajriba (yildan kam emas)', type: 'number' },
    { key: 'hasAchievements', label: 'Yutuqlar', type: 'check' },
  ],
  render: (a) => <AthleteCard key={a._id} a={a} />,
  emptyTitle: 'Sportchilar topilmadi',
};

export default function Page() { return <CatalogPage cfg={cfg} />; }
