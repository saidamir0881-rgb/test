import { Spinner } from '@/components/ui';

export default function Loading() {
  return <div className="flex justify-center py-32"><Spinner className="h-8 w-8 text-brand" /></div>;
}
