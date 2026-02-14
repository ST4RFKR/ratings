import { Badge } from '@/shared/components/ui/badge';
import { Card, CardContent } from '@/shared/components/ui/card';
import { Separator } from '@/shared/components/ui/separator';
import { cn } from '@/shared/lib/utils';

type DashboardMetric = {
  label: string;
  value: string;
  percentage: string;
  isPositive?: boolean;
};

type MainDashboardData = {
  title: string;
  description: string;
  metrics: DashboardMetric[];
  icon?: React.ReactNode;
  footer?: string;
};

type WidgetProps = {
  mainDashboard?: MainDashboardData;
};

const mainDashboardData: MainDashboardData = {
  title: 'Analytics Dashboard',
  description: 'Check all the statistics',
  metrics: [
    {
      label: 'Earnings',
      value: '$27,850',
      percentage: '+18%',
      isPositive: true,
    },
    {
      label: 'Expense',
      value: '$18,453',
      percentage: '-5%',
      isPositive: false,
    },
  ],
};

export const DashboardAnalyticCard = ({ mainDashboard = mainDashboardData }: WidgetProps) => {
  return (
    <Card className='p-0 border rounded-2xl w-full shadow-none'>
      <CardContent className='p-0'>
        <div className='p-6 flex flex-col gap-6'>
          <div className='flex items-start justify-between'>
            <div className='space-y-1'>
              <p className='text-lg font-medium text-card-foreground'>{mainDashboard.title}</p>
              <p className='text-xs font-normal text-muted-foreground'>{mainDashboard.description}</p>
            </div>
            {mainDashboard.icon && (
              <div className='p-2 rounded-full bg-primary/10 text-primary'>
                {mainDashboard.icon}
              </div>
            )}
          </div>
          <div className='flex flex-col sm:flex-row sm:items-center gap-4 flex-wrap'>
            {mainDashboard.metrics.map((metric, index) => (
              <div
                key={index}
                className='flex items-center gap-4 sm:gap-6'
              >
                <div className='flex-1 min-w-0'>
                  <p className='text-xs font-normal text-muted-foreground'>{metric.label}</p>
                  <div className='flex items-center gap-1 flex-wrap'>
                    <p className='text-xl sm:text-2xl font-medium text-card-foreground'>{metric.value}</p>
                    <Badge
                      className={cn(
                        'font-normal text-muted-foreground text-xs',
                        metric.isPositive ? 'bg-teal-400/10' : 'bg-red-500/10',
                      )}
                    >
                      {metric.percentage}
                    </Badge>
                  </div>
                </div>
                {index < mainDashboard.metrics.length - 1 && (
                  <Separator
                    orientation='vertical'
                    className='h-12 hidden sm:block'
                  />
                )}
              </div>
            ))}
          </div>
          {mainDashboard.footer && (
            <p className='text-xs text-muted-foreground pt-2 border-t'>{mainDashboard.footer}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
