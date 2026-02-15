export const ROUTES = {
  HOME: '/',
  LOGIN: '/sign-in',
  SIGNUP: '/sign-up',
  COMPANY: '/company',
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
