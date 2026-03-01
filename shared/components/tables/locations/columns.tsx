'use client';

import { DataTableColumnHeader } from '@/shared/components/tables/data-table';
import { StatusBadge } from '@/shared/components/tables/status-badge';
import { ColumnDef } from '@tanstack/react-table';
import { GripVertical } from 'lucide-react';
import { Checkbox } from '../../ui/checkbox';
import { ActionsDropdown } from './actions-dropdown';

export type LocationTableRow = {
  id: string;
  slug: string;
  name: string;
  rating: number;
  email: string | null;
  status: 'active' | 'inactive';
};

export const columnsLocations: ColumnDef<LocationTableRow>[] = [
  {
    id: 'drag',
    header: '',
    cell: () => (
      <button
        onClick={() => alert('Drag & Drop feature in development ')}
        className='cursor-grab active:cursor-grabbing'
      >
        <GripVertical className='h-4 w-4 text-muted-foreground' />
      </button>
    ),
  },
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate')}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label='Select all'
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label='Select row'
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'name',
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title='Name'
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
  },
  {
    accessorKey: 'email',
    header: 'Email',
    cell: ({ row }) => row.original.email || '-',
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => <StatusBadge status={row.original.status} />,
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => (
      <ActionsDropdown
        locationId={row.original.slug}
        onDelete={(id) => console.log('delete', id)}
        onEdit={(id) => console.log('edit', id)}
      />
    ),
  },
];

