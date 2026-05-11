import type { MetadataRoute } from "next";

const getBaseUrl = () => {
  const url =
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.SITE_URL ||
    "https://catelina.in";

  return url.replace(/\/$/, "");
};

export default function robots(): MetadataRoute.Robots {
  const baseUrl = getBaseUrl();

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api"],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
