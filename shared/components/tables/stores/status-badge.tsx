import { Badge } from '@/shared/components/ui/badge';
import { CheckCircle2, XCircle } from 'lucide-react';

export function StatusBadge({ status }: { status: 'active' | 'inactive' }) {
  const isActive = status === 'active';

  return (
    <Badge
      variant={isActive ? 'default' : 'secondary'}
      className='flex w-fit items-center gap-1.5'
    >
      {isActive ? <CheckCircle2 className='h-3.5 w-3.5' /> : <XCircle className='h-3.5 w-3.5' />}
      {isActive ? 'Active' : 'Inactive'}
    </Badge>
  );
}
