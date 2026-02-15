'use client';

import { Search } from 'lucide-react';
import * as React from 'react';

import { Combobox, ComboboxInput, InputGroupAddon } from '@/shared/components/ui';
import { cn } from '@/shared/lib';

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
