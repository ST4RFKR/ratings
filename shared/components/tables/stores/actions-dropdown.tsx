'use client';

import { Copy, ExternalLink, MoreHorizontal, Pencil, Trash } from 'lucide-react';
import { useRouter } from 'next/navigation';

import { Button } from '@/shared/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu';

interface ActionsDropdownProps {
  storeId: string;
  onDelete?: (id: string) => void;
  onEdit?: (id: string) => void;
}

export function ActionsDropdown({ storeId, onDelete, onEdit }: ActionsDropdownProps) {
  const router = useRouter();

  const handleCopy = () => {
    navigator.clipboard.writeText(storeId);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant='ghost'
          className='h-8 w-8 p-0'
        >
          <MoreHorizontal className='h-4 w-4' />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align='end'>
        <DropdownMenuItem onClick={handleCopy}>
          <Copy className='mr-2 h-4 w-4' />
          Copy ID
        </DropdownMenuItem>

        <DropdownMenuItem onClick={() => router.push(`/dashboard/stores/${storeId}`)}>
          <ExternalLink className='mr-2 h-4 w-4' />
          View store
        </DropdownMenuItem>

        <DropdownMenuItem onClick={() => onEdit?.(storeId)}>
          <Pencil className='mr-2 h-4 w-4' />
          Edit
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => onDelete?.(storeId)}
          className='text-destructive focus:text-destructive'
        >
          <Trash className='mr-2 h-4 w-4' />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
