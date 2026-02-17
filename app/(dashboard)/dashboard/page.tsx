import { JoinCodeBadge } from '@/shared/components/common/join-code-badge';
import { Badge, Card } from '@/shared/components/ui';
import {
  AlertTriangle,
  CircleDotDashed,
  LayoutDashboard,
  MapPin,
  MessageSquareMore,
  Sparkles,
  Star,
  TrendingUp,
  Users,
} from 'lucide-react';
import { getTranslations } from 'next-intl/server';

const reviewWave = [
  { day: 'Mon', reviews: 42 },
  { day: 'Tue', reviews: 58 },
  { day: 'Wed', reviews: 49 },
  { day: 'Thu', reviews: 64 },
  { day: 'Fri', reviews: 72 },
  { day: 'Sat', reviews: 54 },
  { day: 'Sun', reviews: 39 },
];

const categoryStats = [
  { label: 'Speed', score: 82, delta: '+4.1%' },
  { label: 'Politeness', score: 91, delta: '+1.8%' },
  { label: 'Quality', score: 76, delta: '-1.2%' },
  { label: 'Professionalism', score: 88, delta: '+2.3%' },
  { label: 'Cleanliness', score: 73, delta: '-0.7%' },
];

const locationPulse = [
  { name: 'Downtown', rating: 4.8, reviews: 241, activeEmployees: 27 },
  { name: 'Riverside', rating: 4.6, reviews: 198, activeEmployees: 19 },
  { name: 'Central Mall', rating: 4.3, reviews: 172, activeEmployees: 22 },
];

const teamWatch = [
  { name: 'Liam Carter', role: 'Supervisor', rating: 4.9, alerts: 0 },
  { name: 'Mia Flores', role: 'Cashier', rating: 4.2, alerts: 1 },
  { name: 'Noah Smith', role: 'Sales', rating: 3.8, alerts: 2 },
  { name: 'Emma Johnson', role: 'Waiter', rating: 4.6, alerts: 0 },
];

function getDeltaTone(delta: string) {
  return delta.startsWith('+')
    ? 'text-emerald-700 bg-emerald-500/10 dark:text-emerald-400'
    : 'text-amber-700 bg-amber-500/10 dark:text-amber-400';
}

export default async function Page() {
  const t = await getTranslations('dashboard.main');
  const maxReviews = Math.max(1, ...reviewWave.map((item) => item.reviews));

  return (
    <div className='flex flex-1 flex-col gap-4 p-4'>
      <div className='grid gap-6 p-6 lg:grid-cols-[1.5fr_1fr]'>
        <div className='space-y-4'>
          <div className='flex flex-wrap items-start justify-between gap-3'>
            <div className='space-y-2'>
              <div className='flex items-center gap-2'>
                <LayoutDashboard className='h-6 w-6' />
                <h1 className='text-2xl font-semibold'>{t('title')}</h1>
              </div>
              <p className='max-w-xl text-sm text-muted-foreground'>{t('description')}</p>
            </div>
            <div className='flex items-center gap-2 rounded-xl border bg-background/80 px-3 py-2 backdrop-blur'>
              <span className='text-xs font-medium text-muted-foreground'>Invite code</span>
              <JoinCodeBadge code='FRSATD' />
            </div>
          </div>

          <div className='grid gap-2 sm:grid-cols-2 xl:grid-cols-4'>
            <div className='rounded-xl border border-border/60 bg-background/70 p-3'>
              <div className='mb-2 flex items-center justify-between text-muted-foreground'>
                <MessageSquareMore className='h-4 w-4' />
                <span className='text-xs'>7d</span>
              </div>
              <div className='text-xl font-semibold'>378</div>
              <div className='text-xs text-muted-foreground'>reviews collected</div>
            </div>
            <div className='rounded-xl border border-border/60 bg-background/70 p-3'>
              <div className='mb-2 flex items-center justify-between text-muted-foreground'>
                <Star className='h-4 w-4' />
                <span className='text-xs'>avg</span>
              </div>
              <div className='text-xl font-semibold'>4.67</div>
              <div className='text-xs text-muted-foreground'>company rating</div>
            </div>
            <div className='rounded-xl border border-border/60 bg-background/70 p-3'>
              <div className='mb-2 flex items-center justify-between text-muted-foreground'>
                <MapPin className='h-4 w-4' />
                <span className='text-xs'>live</span>
              </div>
              <div className='text-xl font-semibold'>3</div>
              <div className='text-xs text-muted-foreground'>active locations</div>
            </div>
            <div className='rounded-xl border border-border/60 bg-background/70 p-3'>
              <div className='mb-2 flex items-center justify-between text-muted-foreground'>
                <Users className='h-4 w-4' />
                <span className='text-xs'>team</span>
              </div>
              <div className='text-xl font-semibold'>68</div>
              <div className='text-xs text-muted-foreground'>employees on shift</div>
            </div>
          </div>
        </div>

        <div className='rounded-2xl border border-border/70 bg-card/90 p-4'>
          <div className='mb-4 flex items-center justify-between'>
            <div>
              <p className='text-sm font-medium'>Review wave</p>
              <p className='text-xs text-muted-foreground'>Last 7 days</p>
            </div>
            <Badge
              variant='secondary'
              className='gap-1'
            >
              <TrendingUp className='h-3 w-3' />
              +12.4%
            </Badge>
          </div>
          <div className='flex h-36 items-end gap-2'>
            {reviewWave.map((item) => (
              <div
                key={item.day}
                className='flex flex-1 flex-col items-center gap-1'
              >
                <div
                  className='w-full rounded-md bg-gradient-to-t from-primary to-chart-2/80'
                  style={{ height: `${Math.max(16, (item.reviews / maxReviews) * 100)}%` }}
                />
                <span className='text-[10px] text-muted-foreground'>{item.day}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className='grid gap-4 xl:grid-cols-[1.2fr_1fr]'>
        <Card className='gap-4 p-5'>
          <div className='flex items-center justify-between'>
            <div>
              <h2 className='text-lg font-semibold'>Category momentum</h2>
              <p className='text-sm text-muted-foreground'>From `ReviewScore` categories</p>
            </div>
            <CircleDotDashed className='h-5 w-5 text-muted-foreground' />
          </div>
          <div className='space-y-3'>
            {categoryStats.map((item) => (
              <div
                key={item.label}
                className='space-y-1'
              >
                <div className='flex items-center justify-between gap-3'>
                  <p className='text-sm font-medium'>{item.label}</p>
                  <div className='flex items-center gap-2'>
                    <span className='text-sm font-semibold'>{item.score}</span>
                    <Badge
                      variant='ghost'
                      className={getDeltaTone(item.delta)}
                    >
                      {item.delta}
                    </Badge>
                  </div>
                </div>
                <div className='h-2 rounded-full bg-muted'>
                  <div
                    className='h-full rounded-full bg-gradient-to-r from-chart-2 to-primary'
                    style={{ width: `${item.score}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className='gap-4 p-5'>
          <div className='flex items-center justify-between'>
            <div>
              <h2 className='text-lg font-semibold'>Team watchlist</h2>
              <p className='text-sm text-muted-foreground'>Employees needing attention first</p>
            </div>
            <Sparkles className='h-5 w-5 text-muted-foreground' />
          </div>
          <div className='space-y-2'>
            {teamWatch.map((item) => (
              <div
                key={item.name}
                className='rounded-xl border p-3'
              >
                <div className='flex items-start justify-between gap-3'>
                  <div>
                    <p className='text-sm font-medium'>{item.name}</p>
                    <p className='text-xs text-muted-foreground'>{item.role}</p>
                  </div>
                  <div className='text-right'>
                    <p className='text-sm font-semibold'>★ {item.rating}</p>
                    {item.alerts > 0 ? (
                      <Badge className='mt-1 gap-1 bg-amber-500/10 text-amber-700 dark:text-amber-400'>
                        <AlertTriangle className='h-3 w-3' />
                        {item.alerts} alerts
                      </Badge>
                    ) : (
                      <Badge className='mt-1 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400'>stable</Badge>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className='mb-4 flex items-center justify-between'>
        <div>
          <h2 className='text-lg font-semibold'>Location pulse</h2>
          <p className='text-sm text-muted-foreground'>
            Mock snapshot aligned with Company + Location + Employee models
          </p>
        </div>
        <Badge variant='outline'>Realtime board</Badge>
      </div>
      <div className='grid gap-3 md:grid-cols-3'>
        {locationPulse.map((item) => (
          <div
            key={item.name}
            className='rounded-2xl border border-border/70 bg-muted/40 p-4'
          >
            <p className='text-sm font-medium'>{item.name}</p>
            <div className='mt-3 grid grid-cols-2 gap-3 text-sm'>
              <div>
                <p className='text-muted-foreground'>Rating</p>
                <p className='font-semibold'>★ {item.rating}</p>
              </div>
              <div>
                <p className='text-muted-foreground'>Reviews</p>
                <p className='font-semibold'>{item.reviews}</p>
              </div>
              <div className='col-span-2'>
                <p className='text-muted-foreground'>Active employees</p>
                <p className='font-semibold'>{item.activeEmployees}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
