export interface ErrorContext {
  boundary?: string;
  [key: string]: unknown;
}

/**
 * Reports errors to the Lovable error tracking system (no-op in open source / self-hosted builds).
 */
export function reportLovableError(error: Error, context?: ErrorContext): void {
  // In production with Lovable, this would send to their error pipeline.
  // For local / self-hosted usage it is intentionally a no-op.
  console.error("[HeatSatAI]", context?.boundary ?? "unknown", error);
}
