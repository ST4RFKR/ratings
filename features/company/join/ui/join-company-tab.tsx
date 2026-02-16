'use client';

import { CompanyCodeOtpInput } from '@/shared/components/common/input-otp';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { useQueryClient } from '@tanstack/react-query';
import { KeyRound } from 'lucide-react';
import { useState } from 'react';
import { useJoin } from '../model/use-join';
import { useJoinLocation } from '../model/use-join-location';
import { LocationCombobox, LocationItem } from './location-combobox';

export function JoinCompanyTab() {
  const [joinCode, setJoinCode] = useState('');
  const [selectedLocation, setSelectedLocation] = useState<LocationItem | null>(null);

  const joinCompanyMutation = useJoin();
  const selectLocationMutation = useJoinLocation();

  return (
    <Card className='border-none bg-background/80 shadow-lg backdrop-blur-sm'>
      <CardHeader className='space-y-2 text-center'>
        <div className='mx-auto w-fit rounded-full bg-primary/10 p-3'>
          <KeyRound className='h-6 w-6 text-primary' />
        </div>
        <CardTitle className='text-2xl font-bold'>Присоединение к компании</CardTitle>
        <CardDescription>Введите код компании, чтобы подключиться</CardDescription>
      </CardHeader>
      <CardContent className='space-y-6'>
        {!joinCompanyMutation.data ? (
          <div className='flex flex-col items-center gap-3'>
            <CompanyCodeOtpInput
              value={joinCode}
              onChange={setJoinCode}
              disabled={joinCompanyMutation.isPending}
            />
            <p className='text-center text-sm text-muted-foreground'>Введите 6-значный код компании</p>
            <Button
              className='w-full'
              disabled={joinCompanyMutation.isPending || joinCode.length !== 6}
              onClick={() => joinCompanyMutation.mutate({ joinCode })}
            >
              {joinCompanyMutation.isPending ? 'Подключение...' : 'Подключиться'}
            </Button>
          </div>
        ) : (
          <div className='flex flex-col gap-4'>
            <p className='text-center font-medium text-lg'>{joinCompanyMutation.data.companyName}</p>
            <p className='text-center text-sm text-muted-foreground'>Выберите магазин:</p>

            <div className='max-w-sm mx-auto'>
              <LocationCombobox
                locations={joinCompanyMutation.data.locations}
                value={selectedLocation}
                onChange={setSelectedLocation}
              />
            </div>

            <Button
              className='w-full mt-4'
              disabled={!selectedLocation || selectLocationMutation.isPending}
              onClick={() =>
                selectedLocation &&
                selectLocationMutation.mutate({
                  locationId: selectedLocation.id,
                  companyId: joinCompanyMutation.data!.companyId,
                })
              }
            >
              {selectLocationMutation.isPending ? 'Сохраняем...' : 'Подтвердить выбор магазина'}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
