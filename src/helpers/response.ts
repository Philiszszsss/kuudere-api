import { type Context } from 'elysia';
import type { ApiResponse } from './response-types';

export const createSuccessResponse = <T>(
  data: T,
  set?: Context['set'],
  statusCode = 200
): ApiResponse<T> => {
  if (set) {
    set.status = statusCode;
  }

  return {
    success: true,
    data,
    timestamp: new Date().toISOString(),
  };
};

export const createErrorResponse = (
  message: string,
  code = 'INTERNAL_SERVER_ERROR',
  set?: Context['set'],
  statusCode = 500,
  details?: unknown
): ApiResponse<null> => {
  if (set) {
    set.status = statusCode;
  }

  return {
    success: false,
    error: {
      code,
      message,
      details,
    },
    timestamp: new Date().toISOString(),
  };
};
