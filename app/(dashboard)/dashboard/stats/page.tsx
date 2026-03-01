'use client';

import { useGetEmployees } from '@/features/employee/get-employes';
import { useGetLocation } from '@/features/location/get-location/model/use-get-location';
import { useGetReviews } from '@/features/review/get-reviews';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
  Field,
  FieldLabel,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/shared/components/ui';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { ROUTES } from '@/shared/config';
import { BarChart3, MapPin, Search, Users } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useMemo } from 'react';
import { Area, AreaChart, CartesianGrid, Line, LineChart, XAxis, YAxis } from 'recharts';

type StatsRow = {
  label: string;
  reviews: number;
  averageRating: number;
};

type ComboboxItemType = {
  id: string;
  label: string;
  routeValue: string;
};

const LINE_GREEN = 'var(--primary)';
const FILL_GREEN = 'var(--primary)';

function getMonthKey(date: string) {
  const d = new Date(date);
  return `${d.getFullYear()}-${`${d.getMonth() + 1}`.padStart(2, '0')}`;
}

function mapToRows(
  map: Map<string, { label: string; reviews: number; totalRating: number }>,
  limit: number,
): StatsRow[] {
  return [...map.values()]
    .map((item) => ({
      label: item.label,
      reviews: item.reviews,
      averageRating: Number((item.totalRating / item.reviews).toFixed(2)),
    }))
    .sort((a, b) => b.reviews - a.reviews)
    .slice(0, limit);
}

export default function StatsPage() {
  const t = useTranslations('dashboard.stats');
  const locale = useLocale();
  const router = useRouter();
  const employeesQuery = useGetEmployees();
  const locationsQuery = useGetLocation();
  const reviewsQuery = useGetReviews({});

  const employeeItems = useMemo<ComboboxItemType[]>(
    () =>
      (employeesQuery.data ?? []).map((employee) => ({
        id: employee.id,
        label: employee.fullName,
        routeValue: employee.id,
      })),
    [employeesQuery.data],
  );

  const locationItems = useMemo<ComboboxItemType[]>(
    () =>
      (locationsQuery.data ?? []).map((location) => ({
        id: location.id,
        label: location.name,
        routeValue: location.slug,
      })),
    [locationsQuery.data],
  );

  const { employeesData, locationsData, monthlyTrend } = useMemo(() => {
    const reviews = reviewsQuery.data ?? [];
    const employeeMap = new Map<string, { label: string; reviews: number; totalRating: number }>();
    const locationMap = new Map<string, { label: string; reviews: number; totalRating: number }>();
    const months: { key: string; label: string; reviews: number; totalRating: number }[] = [];
    const now = new Date();

    for (let i = 5; i >= 0; i -= 1) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = `${date.getFullYear()}-${`${date.getMonth() + 1}`.padStart(2, '0')}`;
      months.push({
        key,
        label: date.toLocaleDateString(locale, { month: 'short' }),
        reviews: 0,
        totalRating: 0,
      });
    }

    const byKey = new Map(months.map((item) => [item.key, item]));

    for (const review of reviews) {
      const employeeCurrent = employeeMap.get(review.employee.id) ?? {
        label: review.employee.fullName,
        reviews: 0,
        totalRating: 0,
      };
      employeeMap.set(review.employee.id, {
        label: employeeCurrent.label,
        reviews: employeeCurrent.reviews + 1,
        totalRating: employeeCurrent.totalRating + review.rating,
      });

      const locationCurrent = locationMap.get(review.location.id) ?? {
        label: review.location.name,
        reviews: 0,
        totalRating: 0,
      };
      locationMap.set(review.location.id, {
        label: locationCurrent.label,
        reviews: locationCurrent.reviews + 1,
        totalRating: locationCurrent.totalRating + review.rating,
      });

      const month = byKey.get(getMonthKey(review.createdAt));
      if (!month) {
        continue;
      }
      month.reviews += 1;
      month.totalRating += review.rating;
    }

    return {
      employeesData: mapToRows(employeeMap, 8),
      locationsData: mapToRows(locationMap, 8),
      monthlyTrend: months.map((item) => ({
        label: item.label,
        reviews: item.reviews,
        averageRating: item.reviews ? Number((item.totalRating / item.reviews).toFixed(2)) : 0,
      })),
    };
  }, [locale, reviewsQuery.data]);

  return (
    <div className='flex flex-1 flex-col gap-4 p-4'>
      <div className='flex items-center gap-3'>
        <BarChart3 className='h-6 w-6' />
        <h1 className='text-2xl font-semibold'>{t('title')}</h1>
      </div>
      <p className='text-muted-foreground'>{t('description')}</p>

      {reviewsQuery.isLoading ? <p className='text-sm text-muted-foreground'>{t('loading')}</p> : null}

      <div className='grid grid-cols-1 gap-3 md:grid-cols-2'>
        <Field>
          <FieldLabel>{t('selectors.employee.label')}</FieldLabel>
          <Combobox<ComboboxItemType>
            items={employeeItems}
            value={null}
            onValueChange={(item) => {
              if (!item) return;
              router.push(ROUTES.DASHBOARD.EMPLOYEE_DETAILS(item.routeValue));
            }}
          >
            <ComboboxInput
              placeholder={t('selectors.employee.placeholder')}
              className='[&_[data-slot=input-group-control]]:pl-9'
              showClear
              disabled={employeesQuery.isLoading}
            >
              <span className='pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-muted-foreground'>
                <Search className='size-4 text-muted-foreground' />
              </span>
            </ComboboxInput>
            <ComboboxContent>
              <ComboboxEmpty>{t('selectors.employee.empty')}</ComboboxEmpty>
              <ComboboxList>
                {(item) => (
                  <ComboboxItem
                    key={item.id}
                    value={item}
                  >
                    <Users className='size-4 text-muted-foreground' />
                    {item.label}
                  </ComboboxItem>
                )}
              </ComboboxList>
            </ComboboxContent>
          </Combobox>
        </Field>

        <Field>
          <FieldLabel>{t('selectors.location.label')}</FieldLabel>
          <Combobox<ComboboxItemType>
            items={locationItems}
            value={null}
            onValueChange={(item) => {
              if (!item) return;
              router.push(ROUTES.DASHBOARD.LOCATION_DETAILS(item.routeValue));
            }}
          >
            <ComboboxInput
              placeholder={t('selectors.location.placeholder')}
              className='[&_[data-slot=input-group-control]]:pl-9'
              showClear
              disabled={locationsQuery.isLoading}
            >
              <span className='pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-muted-foreground'>
                <Search className='size-4 text-muted-foreground' />
              </span>
            </ComboboxInput>
            <ComboboxContent>
              <ComboboxEmpty>{t('selectors.location.empty')}</ComboboxEmpty>
              <ComboboxList>
                {(item) => (
                  <ComboboxItem
                    key={item.id}
                    value={item}
                  >
                    <MapPin className='size-4 text-muted-foreground' />
                    {item.label}
                  </ComboboxItem>
                )}
              </ComboboxList>
            </ComboboxContent>
          </Combobox>
        </Field>
      </div>

      <Tabs
        defaultValue='employees'
        className='mt-2'
      >
        <TabsList className='grid w-full grid-cols-2 md:w-[380px]'>
          <TabsTrigger
            value='employees'
            className='gap-2'
          >
            <Users className='h-4 w-4' />
            {t('tabs.employees')}
          </TabsTrigger>
          <TabsTrigger
            value='locations'
            className='gap-2'
          >
            <MapPin className='h-4 w-4' />
            {t('tabs.locations')}
          </TabsTrigger>
        </TabsList>

        <TabsContent
          value='employees'
          className='mt-4 space-y-4'
        >
          <Card className='shadow-none'>
            <CardHeader>
              <CardTitle>{t('employees.rating_chart_title')}</CardTitle>
              <CardDescription>{t('employees.rating_chart_description')}</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                className='h-[320px] w-full rounded-xl border border-border bg-card/70 p-2 dark:bg-card/60'
                config={{
                  averageRating: { label: t('chart.average_rating'), color: LINE_GREEN },
                }}
              >
                <AreaChart
                  data={employeesData}
                  accessibilityLayer
                >
                  <defs>
                    <linearGradient
                      id='employeeAreaFill'
                      x1='0'
                      y1='0'
                      x2='0'
                      y2='1'
                    >
                      <stop
                        offset='5%'
                        stopColor={FILL_GREEN}
                        stopOpacity={0.45}
                      />
                      <stop
                        offset='95%'
                        stopColor={FILL_GREEN}
                        stopOpacity={0}
                      />
                    </linearGradient>
                  </defs>
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey='label'
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    minTickGap={24}
                  />
                  <YAxis
                    domain={[0, 5]}
                    tickLine={false}
                    axisLine={false}
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Area
                    type='monotone'
                    dataKey='averageRating'
                    stroke='var(--color-averageRating)'
                    fill='url(#employeeAreaFill)'
                    strokeWidth={2.75}
                  />
                </AreaChart>
              </ChartContainer>
            </CardContent>
          </Card>

          <Card className='shadow-none'>
            <CardHeader>
              <CardTitle>{t('employees.trend_chart_title')}</CardTitle>
              <CardDescription>{t('employees.trend_chart_description')}</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                className='h-[300px] w-full rounded-xl border border-border bg-card/70 p-2 dark:bg-card/60'
                config={{
                  averageRating: { label: t('chart.average_rating'), color: LINE_GREEN },
                }}
              >
                <LineChart
                  data={monthlyTrend}
                  accessibilityLayer
                >
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey='label'
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    domain={[0, 5]}
                    tickLine={false}
                    axisLine={false}
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line
                    type='monotone'
                    dataKey='averageRating'
                    stroke='var(--color-averageRating)'
                    strokeWidth={3}
                    dot={{ r: 3, fill: 'var(--color-averageRating)' }}
                    activeDot={{ r: 5 }}
                  />
                </LineChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent
          value='locations'
          className='mt-4 space-y-4'
        >
          <Card className='shadow-none'>
            <CardHeader>
              <CardTitle>{t('locations.reviews_chart_title')}</CardTitle>
              <CardDescription>{t('locations.reviews_chart_description')}</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                className='h-[320px] w-full rounded-xl border border-border bg-card/70 p-2 dark:bg-card/60'
                config={{
                  averageRating: { label: t('chart.average_rating'), color: LINE_GREEN },
                }}
              >
                <AreaChart
                  data={locationsData}
                  accessibilityLayer
                >
                  <defs>
                    <linearGradient
                      id='locationsAreaFill'
                      x1='0'
                      y1='0'
                      x2='0'
                      y2='1'
                    >
                      <stop
                        offset='5%'
                        stopColor={FILL_GREEN}
                        stopOpacity={0.45}
                      />
                      <stop
                        offset='95%'
                        stopColor={FILL_GREEN}
                        stopOpacity={0}
                      />
                    </linearGradient>
                  </defs>
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey='label'
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    minTickGap={24}
                  />
                  <YAxis
                    domain={[0, 5]}
                    tickLine={false}
                    axisLine={false}
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Area
                    type='monotone'
                    dataKey='averageRating'
                    stroke='var(--color-averageRating)'
                    fill='url(#locationsAreaFill)'
                    strokeWidth={2.75}
                  />
                </AreaChart>
              </ChartContainer>
            </CardContent>
          </Card>

          <Card className='shadow-none'>
            <CardHeader>
              <CardTitle>{t('locations.trend_chart_title')}</CardTitle>
              <CardDescription>{t('locations.trend_chart_description')}</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                className='h-[300px] w-full rounded-xl border border-border bg-card/70 p-2 dark:bg-card/60'
                config={{
                  reviews: { label: t('chart.reviews'), color: LINE_GREEN },
                }}
              >
                <LineChart
                  data={monthlyTrend}
                  accessibilityLayer
                >
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey='label'
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line
                    type='monotone'
                    dataKey='reviews'
                    stroke='var(--color-reviews)'
                    strokeWidth={3}
                    dot={{ r: 2, fill: 'var(--color-reviews)' }}
                    activeDot={{ r: 5 }}
                  />
                </LineChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

