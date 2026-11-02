import Script from "next/script";

// Analítica sin cookies (Umami Cloud): no necesita banner de consentimiento.
// Queda inactiva hasta que el build lleve NEXT_PUBLIC_UMAMI_WEBSITE_ID, y solo cuenta
// visitas en los dominios de producción (ni localhost, ni el alias del hosting, ni el puente).
const WEBSITE_ID = process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID;

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
