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
    STORES: '/dashboard/stores',
    STORE_DETAILS: (id: string) => `/dashboard/stores/${id}`,
  },
} as const;
