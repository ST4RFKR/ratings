import { z } from 'zod/v3';

export const reviewScoreRange = {
  min: 1,
  max: 5,
} as const;

export const createReviewSchema = z.object({
  employeeId: z.string().trim().min(1, { message: 'Select an employee.' }),
  locationId: z.string().trim().min(1, { message: 'Select a location.' }),
  speed: z.coerce
    .number()
    .int()
    .min(reviewScoreRange.min, { message: 'Score must be between 1 and 5.' })
    .max(reviewScoreRange.max, { message: 'Score must be between 1 and 5.' }),
  politeness: z.coerce
    .number()
    .int()
    .min(reviewScoreRange.min, { message: 'Score must be between 1 and 5.' })
    .max(reviewScoreRange.max, { message: 'Score must be between 1 and 5.' }),
  quality: z.coerce
    .number()
    .int()
    .min(reviewScoreRange.min, { message: 'Score must be between 1 and 5.' })
    .max(reviewScoreRange.max, { message: 'Score must be between 1 and 5.' }),
  professionalism: z.coerce
    .number()
    .int()
    .min(reviewScoreRange.min, { message: 'Score must be between 1 and 5.' })
    .max(reviewScoreRange.max, { message: 'Score must be between 1 and 5.' }),
  cleanliness: z.coerce
    .number()
    .int()
    .min(reviewScoreRange.min, { message: 'Score must be between 1 and 5.' })
    .max(reviewScoreRange.max, { message: 'Score must be between 1 and 5.' }),
  comment: z.string().trim().max(1000, { message: 'Comment must be up to 1000 characters.' }).optional(),
});

export type CreateReviewFormValues = z.infer<typeof createReviewSchema>;
