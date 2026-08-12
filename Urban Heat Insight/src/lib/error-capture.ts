let lastCapturedError: Error | undefined;

export function captureError(error: Error) {
  lastCapturedError = error;
}

export function consumeLastCapturedError(): Error | undefined {
  const err = lastCapturedError;
  lastCapturedError = undefined;
  return err;
}

if (typeof window !== "undefined") {
  window.addEventListener("error", (event) => {
    if (event.error instanceof Error) {
      captureError(event.error);
    }
  });

  window.addEventListener("unhandledrejection", (event) => {
    if (event.reason instanceof Error) {
      captureError(event.reason);
    }
  });
}
