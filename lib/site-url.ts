function isLocalOrigin(value: string): boolean {
  try {
    const hostname = new URL(value).hostname;
    return hostname === "localhost" || hostname === "127.0.0.1" || hostname === "::1";
  } catch {
    return false;
  }
}

export function getPublicOrigin(request: Request): string {
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
  const forwardedHost = request.headers.get("x-forwarded-host") ?? request.headers.get("host");
  const forwardedProto = request.headers.get("x-forwarded-proto") ?? "https";

  if (configured && (!isLocalOrigin(configured) || !forwardedHost || forwardedHost.includes("localhost"))) {
    return configured;
  }

  if (forwardedHost) {
    return `${forwardedProto}://${forwardedHost}`;
  }

  return configured ?? new URL(request.url).origin;
}
