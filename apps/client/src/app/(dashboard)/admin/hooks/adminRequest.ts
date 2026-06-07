"use client";

const RATE_LIMIT_STATUS = 429;
const MAX_RETRIES = 3;
const BASE_RETRY_DELAY_MS = 1_000;
const RETRY_BACKOFF_FACTOR = 2;

export const ADMIN_STAGGER_DELAY_MS = 500;

function isRateLimitError(error: unknown): boolean {
  return (error as { response?: { status?: number } })?.response?.status === RATE_LIMIT_STATUS;
}

export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms);
  });
}

export async function requestAdminWithRetry<TResult>(request: () => Promise<TResult>, retries = MAX_RETRIES): Promise<TResult> {
  try {
    return await request();
  } catch (error: unknown) {
    if (!isRateLimitError(error) || retries <= 0) {
      throw error;
    }

    const waitMs = BASE_RETRY_DELAY_MS * Math.pow(RETRY_BACKOFF_FACTOR, MAX_RETRIES - retries);
    await delay(waitMs);
    return requestAdminWithRetry(request, retries - 1);
  }
}
