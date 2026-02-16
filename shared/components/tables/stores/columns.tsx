'use client';

import { ColumnDef } from '@tanstack/react-table';
import { GripVertical } from 'lucide-react';
import { Checkbox } from '../../ui/checkbox';
import { ActionsDropdown } from './actions-dropdown';
import { DataTableColumnHeader } from '@/shared/components/tables/data-table';
import { StatusBadge } from '@/shared/components/tables/status-badge';

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Store = {
  id: string;
  slug: string;
  name: string;
  rating: number;
  employeesCount: number;
  email: string;
  status: 'active' | 'inactive';
};

export const mockStores: Store[] = [
  {
    id: '1',
    slug: 'techmarket',
    name: 'Tech Market',
    rating: 4.7,
    employeesCount: 25,
    email: 'contact@techmarket.com',
    status: 'active',
  },
  {
    id: '2',
    slug: 'freshfood',
    name: 'Fresh Food Shop',
    rating: 4.3,
    employeesCount: 12,
    email: 'info@freshfood.com',
    status: 'active',
  },
  {
    id: '3',
    slug: 'bookworld',
    name: 'Book World',
    rating: 4.9,
    employeesCount: 8,
    email: 'support@bookworld.com',
    status: 'inactive',
  },
  {
    id: '4',
    slug: 'fashionstore',
    name: 'Fashion Store',
    rating: 3.8,
    employeesCount: 40,
    email: 'hello@fashionstore.com',
    status: 'active',
  },
  {
    id: '5',
    slug: 'homeessentials',
    name: 'Home Essentials',
    rating: 4.1,
    employeesCount: 18,
    email: 'sales@homeessentials.com',
    status: 'inactive',
  },
  {
    id: '6',
    slug: 'gadgethub',
    name: 'Gadget Hub',
    rating: 4.5,
    employeesCount: 30,
    email: 'team@gadgethub.com',
    status: 'active',
  },
  {
    id: '7',
    slug: 'petparadise',
    name: 'Pet Paradise',
    rating: 4.2,
    employeesCount: 14,
    email: 'care@petparadise.com',
    status: 'active',
  },
  {
    id: '8',
    slug: 'sportcenter',
    name: 'Sport Center',
    rating: 3.6,
    employeesCount: 22,
    email: 'contact@sportcenter.com',
    status: 'inactive',
  },
  {
    id: '9',
    slug: 'beautycorner',
    name: 'Beauty Corner',
    rating: 4.8,
    employeesCount: 10,
    email: 'info@beautycorner.com',
    status: 'active',
  },
  {
    id: '10',
    slug: 'autopartspro',
    name: 'Auto Parts Pro',
    rating: 3.9,
    employeesCount: 35,
    email: 'sales@autopartspro.com',
    status: 'inactive',
  },
  {
    id: '11',
    slug: 'coffeepoint',
    name: 'Coffee Point',
    rating: 4.6,
    employeesCount: 6,
    email: 'hello@coffeepoint.com',
    status: 'active',
  },
  {
    id: '12',
    slug: 'toykingdom',
    name: 'Toy Kingdom',
    rating: 4.4,
    employeesCount: 16,
    email: 'support@toykingdom.com',
    status: 'active',
  },
  {
    id: '13',
    slug: 'furniturehouse',
    name: 'Furniture House',
    rating: 3.7,
    employeesCount: 50,
    email: 'info@furniturehouse.com',
    status: 'inactive',
  },
  {
    id: '14',
    slug: 'musicstore',
    name: 'Music Store',
    rating: 4.9,
    employeesCount: 9,
    email: 'contact@musicstore.com',
    status: 'active',
  },
  {
    id: '15',
    slug: 'greenhouse',
    name: 'Green Garden',
    rating: 4.0,
    employeesCount: 20,
    email: 'team@greengarden.com',
    status: 'active',
  },
];

export const columnsStores: ColumnDef<Store>[] = [
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
  },
  {
    accessorKey: 'employeesCount',
    header: 'Employees Count',
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => <StatusBadge status={row.getValue('status')} />,
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => (
      <ActionsDropdown
        storeId={row.original.slug}
        onDelete={(id) => console.log('delete', id)}
        onEdit={(id) => console.log('edit', id)}
      />
    ),
  },
];
