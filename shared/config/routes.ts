export const ROUTES = {
  HOME: '/',
  NOT_AUTH: '/not-auth',
  LOGIN: '/sign-in',
  SIGNUP: '/sign-up',
  ONBOARDING: '/onboarding',
  DASHBOARD: {
    HOME: '/dashboard',
    STATS: '/dashboard/stats',
    EMPLOYEES: '/dashboard/employees',
    EMPLOYEE_DETAILS: (id: string) => `/dashboard/employees/${id}`,
    REVIEWS: '/dashboard/reviews',
    REVIEWS_NEW: '/dashboard/reviews/new',
    REVIEWS_NEW_MODAL: '/dashboard/reviews?modal=create-review',
    LOCATIONS: '/dashboard/locations',
    LOCATION_DETAILS: (id: string) => `/dashboard/locations/${id}`,
  },
} as const;

