'use client';

import { Search } from 'lucide-react';
import * as React from 'react';

import { Combobox, ComboboxInput } from '@/shared/components/ui/combobox';
import { InputGroupAddon } from '@/shared/components/ui/input-group';
import { cn } from '@/shared/lib/utils';

interface SearchInputProps extends React.ComponentProps<typeof ComboboxInput> {
  wrapperClassName?: string;
}

export function SearchInput({ wrapperClassName, className, ...props }: SearchInputProps) {
  return (
    <Combobox>
      <ComboboxInput
        className={cn('max-w-sm', wrapperClassName)}
        showClear
        showTrigger={false}
        {...props}
      >
        <InputGroupAddon align='inline-start'>
          <Search className='text-muted-foreground size-4' />
        </InputGroupAddon>
      </ComboboxInput>
    </Combobox>
  );
}
