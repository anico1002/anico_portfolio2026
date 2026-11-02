import Script from "next/script";

// Analítica sin cookies (Umami Cloud): no necesita banner de consentimiento.
// El ID es público (sale en el HTML). Solo cuenta visitas en los dominios de producción:
// ni localhost, ni el alias del hosting, ni el puente de Cloudflare.
const WEBSITE_ID = process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID ?? "47b40bc6-6e30-4d89-939b-73213060bd21";

export default function SiteAnalytics() {
  if (!WEBSITE_ID) return null;
  return (
    <Script
      src="https://cloud.umami.is/script.js"
      data-website-id={WEBSITE_ID}
      data-domains="anico.design,www.anico.design"
      strategy="afterInteractive"
    />
  );
}
