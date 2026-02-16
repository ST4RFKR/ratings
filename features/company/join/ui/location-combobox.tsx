'use client';

import { InputGroupAddon } from '@/shared/components/ui';
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from '@/shared/components/ui/combobox';
import { Building } from 'lucide-react';
import { useMemo } from 'react';

export interface Location {
  id: string;
  name: string;
  address?: string;
}

export interface LocationItem {
  id: string;
  label: string;
  address?: string;
}

interface Props {
  locations: Location[];
  value: LocationItem | null;
  onChange: (value: LocationItem | null) => void;
}

export function LocationCombobox({ locations, value, onChange }: Props) {
  const items: LocationItem[] = useMemo(
    () =>
      locations.map((loc) => ({
        id: loc.id,
        label: loc.name,
        address: loc.address,
      })),
    [locations],
  );

  const selected: LocationItem | undefined = value ? items.find((i) => i.id === value.id) : undefined;

  return (
    <Combobox
      items={items}
      value={value}
      onValueChange={onChange}
    >
      <ComboboxInput placeholder='Select a timezone'>
        <InputGroupAddon>
          <Building />
        </InputGroupAddon>
      </ComboboxInput>
      <ComboboxContent
        alignOffset={-28}
        className='w-60'
      >
        <ComboboxEmpty>No timezones found.</ComboboxEmpty>
        <ComboboxList>
          {(item) => (
            <ComboboxItem
              key={item.code}
              value={item}
            >
              {item.label}
            </ComboboxItem>
          )}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  );
}
