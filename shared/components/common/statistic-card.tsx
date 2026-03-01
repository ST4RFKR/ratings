'use client';
import { Badge, Card, CardContent, Separator } from '@/shared/components/ui';
import { cn } from '@/shared/lib';
import { MapPin, MessageSquare, Star, TrendingUp, Users } from 'lucide-react';
import { useTranslations } from 'next-intl';

export const StatisticsCard = () => {
  const t = useTranslations('dashboard.main');

  const EcommerceActions = [
    {
      title: t('avg_rating'),
      subtitle: '4.8',
      cardIcon: (
        <Star
          width={14}
          height={14}
        />
      ),
      badgeColor: 'bg-teal-400/10',
      statusValue: '+2.1%',
      statusIcon: <TrendingUp />,
    },
    {
      title: t('total_reviews'),
      subtitle: '12,450',
      cardIcon: (
        <MessageSquare
          width={14}
          height={14}
        />
      ),
      badgeColor: 'bg-teal-400/10',
      statusValue: '+12%',
      statusIcon: <TrendingUp />,
    },
    {
      title: t('active_locations'),
      subtitle: '42',
      cardIcon: (
        <MapPin
          width={14}
          height={14}
        />
      ),
      badgeColor: 'bg-teal-400/10',
      statusValue: '+2',
      statusIcon: <TrendingUp />,
    },
    {
      title: t('total_employees'),
      subtitle: '156',
      cardIcon: (
        <Users
          width={14}
          height={14}
        />
      ),
      badgeColor: 'bg-teal-400/10',
      statusValue: '+5',
      statusIcon: <TrendingUp />,
    },
  ];

  return (
    <div className='max-w-7xl mx-auto px-4 w-full'>
      <Card className='p-0'>
        <CardContent className='flex items-center w-full lg:flex-nowrap flex-wrap px-0'>
          {EcommerceActions.map((item, index) => {
            return (
              <div
                className={cn(
                  'lg:w-3/12 md:w-6/12 w-full border-e border-border last:border-e-0',
                  index === 1 && 'md:max-lg:border-e-0',
                )}
                key={index}
              >
                <div className='p-6'>
                  <div className='flex flex-col gap-1'>
                    <div className='flex justify-between items-start'>
                      <h5 className='text-base font-medium'>{item.title}</h5>
                      <div className={`p-3 rounded-full outline outline-border text-primary`}>{item.cardIcon}</div>
                    </div>
                    <div className='flex flex-col gap-1'>
                      <h5 className='text-2xl font-semibold'>{item.subtitle}</h5>
                      <div className='flex items-center gap-2'>
                        <p className='text-xs text-muted-foreground'>{t('last-7-days')}</p>
                        <Badge className={`${item.badgeColor} text-muted-foreground`}>
                          <div className='flex items-center gap-1'>{item.statusValue}</div>
                          {item.statusIcon}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
                <Separator
                  className={cn(
                    'block lg:hidden',
                    index === EcommerceActions.length - 1 && 'hidden',
                    index === EcommerceActions.length - 2 && 'md:hidden',
                  )}
                />
              </div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
};
