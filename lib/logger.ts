import "server-only";

export interface RequestLogContext {
  path?: string;
  method?: string;
  requestId: string;
  clientIp?: string;
}

export function getRequestId(request: Request): string {
  return request.headers.get("x-request-id")?.trim() || crypto.randomUUID();
}

export function getRequestLogContext(request: Request): RequestLogContext {
  const url = new URL(request.url);

  return {
    path: url.pathname,
    method: request.method,
    requestId: getRequestId(request),
    clientIp: getClientIp(request),
  };
}

export function getClientIp(request: Request): string {
  const forwardedFor = request.headers.get("x-forwarded-for");

  if (forwardedFor) {
    return forwardedFor.split(",")[0]?.trim() || "unknown";
  }

  return request.headers.get("x-real-ip")?.trim() || "unknown";
}

function formatError(error: unknown) {
  if (error instanceof Error) {
    return {
      name: error.name,
      message: error.message,
      stack: error.stack,
    };
  }

  return {
    message: "Unexpected error",
    value: String(error),
  };
}

export function logError(scope: string, error: unknown, context?: object) {
  console.error(
    JSON.stringify({
      level: "error",
      scope,
      ...context,
      error: formatError(error),
      timestamp: new Date().toISOString(),
    }),
  );
}

export function withRequestId(
  response: Response,
  requestId: string,
  extraHeaders?: Record<string, string>,
) {
  const headers = new Headers(response.headers);
  headers.set("x-request-id", requestId);
  headers.set("request-id", requestId);

  for (const [key, value] of Object.entries(extraHeaders ?? {})) {
    headers.set(key, value);
  }

  return new Response(response.body, {
    headers,
    status: response.status,
    statusText: response.statusText,
  });
}
