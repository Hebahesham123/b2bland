export const DEFAULT_BANNER_URL =
  "https://cdn.shopify.com/s/files/1/0949/0949/7707/files/FF_Banner_ENG_jpg_b7471bdc-caa7-44a4-9c98-a80724a42f87.jpg?v=1786294752";

export const DEFAULT_LOGO_URL = "/logo.png";

// Values that should never win over the default banner: empty, or the legacy
// placeholder that older campaigns were created with.
const LEGACY_BANNER_URLS = ["/banner.png", "banner.png"];

export function resolveBannerUrl(url: string | null | undefined): string {
  const v = (url ?? "").trim();
  if (!v || LEGACY_BANNER_URLS.includes(v)) return DEFAULT_BANNER_URL;
  return v;
}
