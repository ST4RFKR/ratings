import { NextResponse } from 'next/server';
function createError(status: number, message: string, code?: string) {
  return NextResponse.json(
    {
      message,
      ...(code && { code }),
    },
    { status },
  );
}

export const ApiErrors = {
  badRequest: (message = 'Bad request') => createError(400, message),

  unauthorized: (message = 'Unauthorized') => createError(401, message),

  forbidden: (message = 'Forbidden') => createError(403, message),

  notFound: (message = 'Not found') => createError(404, message),

  conflict: (message = 'Conflict') => createError(409, message),

  internal: (message = 'Internal server error') => createError(500, message),
};
