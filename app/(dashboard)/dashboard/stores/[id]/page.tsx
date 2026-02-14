import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { MapPin, Star, Store, Users } from 'lucide-react';
import { getTranslations } from 'next-intl/server';
// import { useTranslations } from 'next-intl';

export default async function StoreDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const t = getTranslations('dashboard.stores');
  const { id } = await params;

  return (
    <div className='flex flex-1 flex-col gap-4 p-4'>
      <div className='flex items-center gap-3'>
        <Store className='h-6 w-6' />
        <h1 className='text-2xl font-semibold'>Store Details: </h1>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Total Rating</CardTitle>
            <Star className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>4.8</div>
            <p className='text-xs text-muted-foreground'>+2.1% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Total Reviews</CardTitle>
            <Users className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>+1,240</div>
            <p className='text-xs text-muted-foreground'>+180.1% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Location</CardTitle>
            <MapPin className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>Downtown</div>
            <p className='text-xs text-muted-foreground'>Main Street, 123</p>
          </CardContent>
        </Card>
      </div>

      <Card className='mt-4'>
        <CardHeader>
          <CardTitle>Historical Performance</CardTitle>
        </CardHeader>
        <CardContent className='h-[300px] flex items-center justify-center border-2 border-dashed rounded-lg'>
          <p className='text-muted-foreground'>Analytics Chart Placeholder</p>
        </CardContent>
      </Card>
    </div>
  );
}
