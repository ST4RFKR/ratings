'use client';

import { DataTableColumnHeader } from '@/shared/components/tables/data-table';
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shared/components/ui';
import { ROUTES } from '@/shared/config';
import { ColumnDef } from '@tanstack/react-table';
import { ExternalLink, MapPin, MoreHorizontal, User } from 'lucide-react';
import { useRouter } from 'next/navigation';

export type ReviewTableRow = {
  id: string;
  employeeId: string;
  employeeName: string;
  locationSlug: string;
  locationName: string;
  rating: number;
  comment: string | null;
  createdAt: string;
};

function formatReviewDate(value: string) {
  return new Intl.DateTimeFormat('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value));
}

export const columnsReviews: ColumnDef<ReviewTableRow>[] = [
  {
    accessorKey: 'employeeName',
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title='Employee'
      />
    ),
  },
  {
    accessorKey: 'locationName',
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title='Location'
      />
    ),
  },
  {
    accessorKey: 'rating',
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title='Rating'
      />
    ),
    cell: ({ row }) => row.original.rating.toFixed(2),
  },
  {
    accessorKey: 'comment',
    header: 'Comment',
    cell: ({ row }) => row.original.comment || '-',
  },
  {
    accessorKey: 'createdAt',
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title='Date'
      />
    ),
    cell: ({ row }) => formatReviewDate(row.original.createdAt),
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => <ReviewActionsDropdown row={row.original} />,
  },
];

function ReviewActionsDropdown({ row }: { row: ReviewTableRow }) {
  const router = useRouter();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant='ghost'
          size='sm'
          className='h-8 w-8 p-0'
        >
          <MoreHorizontal className='h-4 w-4' />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end'>
        <DropdownMenuItem onClick={() => router.push(ROUTES.DASHBOARD.EMPLOYEE_DETAILS(row.employeeId))}>
          <User className='mr-2 h-4 w-4' />
          Open employee
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => router.push(ROUTES.DASHBOARD.LOCATION_DETAILS(row.locationSlug))}>
          <MapPin className='mr-2 h-4 w-4' />
          Open location
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => navigator.clipboard.writeText(row.id)}>
          <ExternalLink className='mr-2 h-4 w-4' />
          Copy review ID
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}


