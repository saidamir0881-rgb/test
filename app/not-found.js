import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="container-x py-28 text-center">
      <p className="font-display text-6xl font-bold text-brand">404</p>
      <h1 className="mt-4 font-display text-2xl font-bold">Sahifa topilmadi</h1>
      <p className="mt-2 text-muted">Bu manzil mavjud emas yoki o'chirilgan.</p>
      <Link href="/" className="btn btn-primary mt-6">Bosh sahifaga qaytish</Link>
    </div>
  );
}
