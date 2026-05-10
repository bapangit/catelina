import connectDB from "@/config/DBConnect";
import Product from "@/config/models/product";
import { getProductPath } from "@/lib/productUrl";
import type { MetadataRoute } from "next";

type ProductSitemapRecord = {
  _id: string | { toString(): string };
  title?: string;
  updatedAt?: Date | string;
};

const getBaseUrl = () => {
  const url =
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.SITE_URL ||
    "https://catelina.in";

  return url.replace(/\/$/, "");
};

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = getBaseUrl();
  const now = new Date();
  const routes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: now,
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${baseUrl}/products`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/categories`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/most-ordered`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.6,
    },
  ];

  await connectDB();

  const products = await Product.find({ published: true })
    .select("_id title updatedAt")
    .sort({ updatedAt: -1 })
    .lean<ProductSitemapRecord[]>();

  return [
    ...routes,
    ...products.map((product) => ({
      url: `${baseUrl}${getProductPath(product)}`,
      lastModified: product.updatedAt || now,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
  ];
}
