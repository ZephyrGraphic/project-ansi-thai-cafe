export function isDatabaseUnavailableError(error: unknown) {
  const details = error as {
    code?: string;
    name?: string;
    message?: string;
  };

  const message = details.message ?? "";

  return (
    details.code === "P1001" ||
    details.name === "PrismaClientInitializationError" ||
    message.includes("Can't reach database server") ||
    message.includes("Unable to resolve database host")
  );
}

export function canUseDemoFallback() {
  return process.env.NODE_ENV !== "production" && process.env.DISABLE_DEMO_FALLBACK !== "true";
}

export function shouldUseDemoFallback(error: unknown) {
  return canUseDemoFallback() && isDatabaseUnavailableError(error);
}

export function logDemoFallback(scope: string, error: unknown) {
  const details = error as { message?: string };
  console.warn(`[demo-fallback] ${scope}: ${details.message ?? "database unavailable"}`);
}

