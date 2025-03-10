import { headers } from "next/headers";


export const getSiteContext = async () => {
  const isServer = typeof window === "undefined";

  if (isServer) {
    const headersList = await headers();
    const host = headersList.get("host") || "";
    const protocol = headersList.get("x-forwarded-proto") || "http";
    const fullUrl = `${protocol}://${host}${headersList.get("x-url") || ""}`;
    return {
      domain: host,
      page: fullUrl,
    };
  } else {
    return {
      domain: window.location.hostname,
      page: window.location.href,
    };
  }
}