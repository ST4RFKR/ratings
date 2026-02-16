'use client';

import { Copy } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { Badge, Tooltip, TooltipContent, TooltipTrigger } from '../ui';

interface JoinCodeBadgeProps {
  code: string;
}

export function JoinCodeBadge({ code }: JoinCodeBadgeProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      toast.info('Join code copied to clipboard');
      setTimeout(() => setCopied(false), 1500);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Badge
          variant='secondary'
          className='cursor-pointer inline-flex items-center gap-2'
          onClick={handleCopy}
        >
          <span className='tracking-widest'>{code}</span>
          <Copy className='w-4 h-4' />
        </Badge>
      </TooltipTrigger>
      <TooltipContent>Click to copy join code</TooltipContent>
    </Tooltip>
  );
}
