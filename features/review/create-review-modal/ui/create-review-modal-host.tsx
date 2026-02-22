'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';
import { CreateReviewModal } from './create-review-modal';

const MODAL_QUERY_KEY = 'modal';
const MODAL_QUERY_VALUE = 'create-review';

export function CreateReviewModalHost() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const isOpen = searchParams.get(MODAL_QUERY_KEY) === MODAL_QUERY_VALUE;

  const handleOpenChange = useCallback(
    (open: boolean) => {
      const params = new URLSearchParams(searchParams.toString());

      if (open) {
        params.set(MODAL_QUERY_KEY, MODAL_QUERY_VALUE);
      } else if (params.get(MODAL_QUERY_KEY) === MODAL_QUERY_VALUE) {
        params.delete(MODAL_QUERY_KEY);
      }

      const query = params.toString();
      const href = query ? `${pathname}?${query}` : pathname;

      router.replace(href, { scroll: false });
    },
    [pathname, router, searchParams],
  );

  return (
    <CreateReviewModal
      open={isOpen}
      onOpenChange={handleOpenChange}
    />
  );
}
