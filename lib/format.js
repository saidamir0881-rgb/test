const MONTHS = ['yanvar', 'fevral', 'mart', 'aprel', 'may', 'iyun', 'iyul', 'avgust', 'sentabr', 'oktabr', 'noyabr', 'dekabr'];

export const fmtDate = (d) => {
  if (!d) return '—';
  const x = new Date(d);
  return `${x.getDate()} ${MONTHS[x.getMonth()]} ${x.getFullYear()}`;
};
export const daysLeft = (d) => Math.ceil((new Date(d) - Date.now()) / 86400000);
export const toInputDate = (d) => (d ? new Date(d).toISOString().slice(0, 10) : '');
export const initials = (name = '') => name.split(/\s+/).filter(Boolean).slice(0, 2).map((s) => s[0]).join('').toUpperCase() || '?';

export const STATUS_LABEL = { pending: 'Kutilmoqda', accepted: 'Qabul qilindi', rejected: 'Rad etildi', withdrawn: 'Qaytarib olindi', approved: 'Tasdiqlangan' };
export const levelLabel = (v) => ({ maktab: 'Maktab', tuman: 'Tuman', viloyat: 'Viloyat', respublika: 'Respublika', xalqaro: 'Xalqaro' }[v] || v);
export const typeLabel = (v) => ({ jihoz: 'Sport jihozlari', mashgulot: "Mashg'ulot xarajatlari", lager: 'Sport lageri', musobaqa: 'Musobaqa xarajatlari', homiylik: 'Homiylik dasturi' }[v] || v);
export const reasonLabel = (v) => ({ soxta_profil: 'Soxta profil', nomaqbul_kontent: 'Nomaqbul kontent', firibgarlik: 'Firibgarlik', boshqa: 'Boshqa' }[v] || v);
export const roleLabel = (v) => ({ athlete: 'Sportchi', coach: 'Murabbiy', club: 'Sport klubi', admin: 'Administrator' }[v] || v);
