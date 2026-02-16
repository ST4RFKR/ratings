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
  name: string;
  role: string;
  store: string;
  rating: number;
  reviews: number;
  email: string;
  status: 'active' | 'inactive';
};

export const mockEmployees: Employee[] = [
  {
    id: '1',
    name: 'John Doe',
    role: 'Senior Manager',
    store: 'Tech Market',
    rating: 4.98,
    reviews: 120,
    email: 'john.doe@techmarket.com',
    status: 'active',
  },
  {
    id: '2',
    name: 'Jane Smith',
    role: 'Store Assistant',
    store: 'Fresh Food Shop',
    rating: 4.85,
    reviews: 85,
    email: 'jane.smith@freshfood.com',
    status: 'active',
  },
  {
    id: '3',
    name: 'Mike Johnson',
    role: 'Cashier',
    store: 'Book World',
    rating: 4.65,
    reviews: 60,
    email: 'mike.johnson@bookworld.com',
    status: 'active',
  },
  {
    id: '4',
    name: 'Sara Patel',
    role: 'Customer Experience Lead',
    store: 'Green Garden',
    rating: 4.92,
    reviews: 102,
    email: 'sara.patel@greengarden.com',
    status: 'active',
  },
  {
    id: '5',
    name: 'Carlos Vega',
    role: 'Shift Supervisor',
    store: 'Gadget Hub',
    rating: 4.73,
    reviews: 75,
    email: 'carlos.vega@gadgethub.com',
    status: 'active',
  },
  {
    id: '6',
    name: 'Emily Carter',
    role: 'Visual Merchandiser',
    store: 'Fashion Store',
    rating: 4.46,
    reviews: 54,
    email: 'emily.carter@fashionstore.com',
    status: 'inactive',
  },
  {
    id: '7',
    name: 'Dmitry Ivanov',
    role: 'Warehouse Coordinator',
    store: 'Home Essentials',
    rating: 4.31,
    reviews: 48,
    email: 'dmitry.ivanov@homeessentials.com',
    status: 'active',
  },
  {
    id: '8',
    name: 'Priya Kumar',
    role: 'Inventory Analyst',
    store: 'Sport Center',
    rating: 4.67,
    reviews: 69,
    email: 'priya.kumar@sportcenter.com',
    status: 'active',
  },
  {
    id: '9',
    name: "Liam O'Connor",
    role: 'Barista',
    store: 'Coffee Point',
    rating: 4.88,
    reviews: 118,
    email: 'liam.oconnor@coffeepoint.com',
    status: 'active',
  },
  {
    id: '10',
    name: 'Nora Lee',
    role: 'Assistant Store Manager',
    store: 'Pet Paradise',
    rating: 4.55,
    reviews: 66,
    email: 'nora.lee@petparadise.com',
    status: 'inactive',
  },
];

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
    accessorKey: 'store',
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title='Store'
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
    cell: ({ row }) => <StatusBadge status={row.getValue('status')} />,
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
