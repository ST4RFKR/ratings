'use client';

import { DataTableColumnHeader } from '@/shared/components/tables/data-table';
import { StatusBadge } from '@/shared/components/tables/status-badge';
import {
  Button,
  Checkbox,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shared/components/ui';
import { ROUTES } from '@/shared/config';
import { ColumnDef } from '@tanstack/react-table';
import { Copy, ExternalLink, GripVertical, Mail, MoreHorizontal, Pencil, Trash } from 'lucide-react';
import { useRouter } from 'next/navigation';

export type Employee = {
  id: string;
  fullName: string;
  role: string;
  locationName: string;
  rating: number;
  reviews: number;
  email: string;
  status: 'PENDING' | 'ACTIVE' | 'BLOCKED';
};

export const columnsEmployees: ColumnDef<Employee>[] = [
  {
    id: 'drag',
    header: '',
    cell: () => (
      <button
        onClick={() => alert('Drag & Drop feature in development')}
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
    accessorKey: 'fullName',
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
    accessorKey: 'locationName',
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title='Location'
      />
    ),
  },

  {
    accessorKey: 'role',
    header: 'Role',
  },

  {
    accessorKey: 'reviews',
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title='Reviews'
      />
    ),
  },
  {
    accessorKey: 'email',
    header: 'Email',
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => <StatusBadge status={row.original.status === 'ACTIVE' ? 'active' : 'inactive'} />,
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => <EmployeeActionsDropdown employee={row.original} />,
  },
];

function EmployeeActionsDropdown({ employee }: { employee: Employee }) {
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
        <DropdownMenuItem onClick={() => router.push(ROUTES.DASHBOARD.EMPLOYEE_DETAILS(employee.id))}>
          <ExternalLink className='mr-2 h-4 w-4' />
          View profile
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => router.push(`${ROUTES.DASHBOARD.EMPLOYEE_DETAILS(employee.id)}/edit`)}>
          <Pencil className='mr-2 h-4 w-4' />
          Edit info
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => navigator.clipboard.writeText(employee.email)}>
          <Copy className='mr-2 h-4 w-4' />
          Copy email
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => (window.location.href = `mailto:${employee.email}`)}>
          <Mail className='mr-2 h-4 w-4' />
          Message
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => console.log('terminate', employee.id)}
          className='text-destructive focus:text-destructive'
        >
          <Trash className='mr-2 h-4 w-4' />
          Terminate
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
