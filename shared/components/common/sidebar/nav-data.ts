'use client';
import { ROUTES } from '@/shared/config';
import { BarChart3, LayoutDashboard, PlusCircle, Star, Store, Users } from 'lucide-react';

export const sidebarNav = [
    {
        title: 'dashboard',
        url: ROUTES.DASHBOARD.HOME,
        icon: LayoutDashboard,
    },
    {
        title: 'stores',
        url: ROUTES.DASHBOARD.STORES,
        icon: Store,
    },
    {
        title: 'employees',
        url: ROUTES.DASHBOARD.EMPLOYEES,
        icon: Users,
    },
    {
        title: 'reviews',
        url: ROUTES.DASHBOARD.REVIEWS,
        icon: Star,
    },
    {
        title: 'new-review',
        url: ROUTES.DASHBOARD.REVIEWS_NEW,
        icon: PlusCircle,
    },
    {
        title: 'stats',
        url: ROUTES.DASHBOARD.STATS,
        icon: BarChart3,
    },
];
