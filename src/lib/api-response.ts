import { NextResponse } from 'next/server';
import { z } from 'zod';
import { logger } from './logger';

/**
 * Centralized API response helpers
 * Provides consistent error handling and response formatting across all API routes
 */

interface ErrorDetails {
  field?: string;
  message: string;
}

/**
 * Handles errors and returns appropriate JSON response
 * - Zod errors return 400 with validation details (only in development)
 * - Generic errors return 500
 */
export function errorResponse(error: unknown, customMessage?: string) {
  // Handle Zod validation errors
  if (error instanceof z.ZodError) {
    const details: ErrorDetails[] = error.issues.map((issue) => ({
      field: issue.path.join('.'),
      message: issue.message,
    }));

    return NextResponse.json(
      {
        error: customMessage || 'Invalid request data',
        // Only expose validation details in development
        ...(process.env.NODE_ENV === 'development' && { details }),
      },
      { status: 400 }
    );
  }

  // Handle known errors with messages
  if (error instanceof Error) {
    // Log full error details server-side
    logger.error({ error, message: error.message, stack: error.stack }, 'API Error');

    // Only return generic message to client in production
    if (process.env.NODE_ENV === 'production') {
      return NextResponse.json(
        { error: customMessage || 'Internal server error' },
        { status: 500 }
      );
    }

    // In development, return actual error message
    return NextResponse.json(
      { error: customMessage || error.message },
      { status: 500 }
    );
  }

  // Unknown error type
  logger.error({ error, type: typeof error }, 'Unknown error type in API');
  return NextResponse.json(
    { error: customMessage || 'Internal server error' },
    { status: 500 }
  );
}

/**
 * Returns 401 Unauthorized response
 */
export function unauthorizedResponse(message = 'Unauthorized') {
  return NextResponse.json({ error: message }, { status: 401 });
}

/**
 * Returns 403 Forbidden response
 */
export function forbiddenResponse(message = 'Forbidden') {
  return NextResponse.json({ error: message }, { status: 403 });
}

/**
 * Returns 404 Not Found response
 */
export function notFoundResponse(message = 'Resource not found') {
  return NextResponse.json({ error: message }, { status: 404 });
}

/**
 * Returns 400 Bad Request response
 */
export function badRequestResponse(message = 'Bad request') {
  return NextResponse.json({ error: message }, { status: 400 });
}

/**
 * Returns 409 Conflict response
 */
export function conflictResponse(message = 'Resource conflict') {
  return NextResponse.json({ error: message }, { status: 409 });
}

/**
 * Returns 429 Too Many Requests response
 */
export function rateLimitResponse(message = 'Too many requests') {
  return NextResponse.json(
    { error: message },
    {
      status: 429,
      headers: {
        'Retry-After': '60', // Suggest retry after 60 seconds
      },
    }
  );
}

/**
 * Returns success response with data
 */
export function successResponse<T>(data: T, status = 200) {
  return NextResponse.json(data, { status });
}

/**
 * Returns 201 Created response
 */
export function createdResponse<T>(data: T) {
  return NextResponse.json(data, { status: 201 });
}

/**
 * Returns 204 No Content response
 */
export function noContentResponse() {
  return new NextResponse(null, { status: 204 });
}
