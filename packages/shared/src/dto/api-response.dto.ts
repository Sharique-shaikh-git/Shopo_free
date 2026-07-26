import { z } from 'zod';
import { type ErrorCode } from '../constants/error-codes';

/**
 * Standard API response wrapper.
 *
 * ALL API responses use this shape — no exceptions.
 * Connected to: [[04_Code_Patterns/structured-error-codes]]
 */
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: {
    code: ErrorCode;
    message: string;
    details?: Record<string, unknown>;
  };
  meta?: {
    correlationId: string;
    timestamp: string;
  };
}

/**
 * Factory function for success responses.
 */
export function createSuccessResponse<T>(
  data: T,
  correlationId: string,
): ApiResponse<T> {
  return {
    success: true,
    data,
    meta: {
      correlationId,
      timestamp: new Date().toISOString(),
    },
  };
}

/**
 * Factory function for error responses.
 */
export function createErrorResponse(
  code: ErrorCode,
  message: string,
  correlationId: string,
  details?: Record<string, unknown>,
): ApiResponse<never> {
  return {
    success: false,
    error: {
      code,
      message,
      details,
    },
    meta: {
      correlationId,
      timestamp: new Date().toISOString(),
    },
  };
}
