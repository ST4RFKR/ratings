'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Briefcase, MessageSquare, Star, User } from 'lucide-react';
import { useTranslations } from 'next-intl';

export default function EmployeeDetailPage({ params }: { params: { id: string } }) {
  const t = useTranslations('dashboard.employees');

  return (
    <div className='flex flex-1 flex-col gap-4 p-4'>
      <div className='flex items-center gap-3'>
        <User className='h-6 w-6' />
        <h1 className='text-2xl font-semibold'>Employee Details: {params.id}</h1>
      </div>
      
      <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Average Rating</CardTitle>
            <Star className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>4.9</div>
            <p className='text-xs text-muted-foreground'>+0.1 from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Total Reviews</CardTitle>
            <MessageSquare className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>156</div>
            <p className='text-xs text-muted-foreground'>+12 from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Role</CardTitle>
            <Briefcase className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>Senior Manager</div>
            <p className='text-xs text-muted-foreground'>Joined 2 years ago</p>
          </CardContent>
        </Card>
      </div>

      <Card className='mt-4'>
        <CardHeader>
          <CardTitle>Performance History</CardTitle>
        </CardHeader>
        <CardContent className='h-[300px] flex items-center justify-center border-2 border-dashed rounded-lg'>
          <p className='text-muted-foreground'>Employee Growth Chart Placeholder</p>
        </CardContent>
      </Card>
    </div>
  );
}
