'use client';
import { BarChart3, LayoutDashboard, PlusCircle, Star, Store, Users } from 'lucide-react';

export const sidebarNav = [
  {
    title: 'dashboard',
    url: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    title: 'stores',
    url: '/dashboard/stores',
    icon: Store,
  },
  {
    title: 'employees',
    url: '/dashboard/employees',
    icon: Users,
  },
  {
    title: 'reviews',
    url: '/dashboard/reviews',
    icon: Star,
  },
  {
    title: 'new-review',
    url: '/dashboard/reviews/new',
    icon: PlusCircle,
  },
  {
    title: 'stats',
    url: '/dashboard/stats',
    icon: BarChart3,
  },
];
