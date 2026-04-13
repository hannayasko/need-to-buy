function normalizeUrl(url: string) {
  if (!url) {
    return "";
  }

  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url.replace(/\/+$/, "");
  }

  return `https://${url}`.replace(/\/+$/, "");
}

export function getSiteUrl() {
  const envSiteUrl = normalizeUrl(process.env.NEXT_PUBLIC_SITE_URL ?? "");

  if (envSiteUrl) {
    return envSiteUrl;
  }

  if (typeof window !== "undefined" && window.location.origin) {
    return window.location.origin.replace(/\/+$/, "");
  }

  const vercelUrl = normalizeUrl(process.env.NEXT_PUBLIC_VERCEL_URL ?? "");

  if (vercelUrl) {
    return vercelUrl;
  }

  return "http://localhost:3000";
}

export function getAuthRedirectUrl(path = "/auth") {
  return new URL(path, `${getSiteUrl()}/`).toString();
}
