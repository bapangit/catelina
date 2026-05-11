import { Suspense } from "react";
import type { Metadata } from "next";
import ProductsClient from "./ProductsClient";

export const metadata: Metadata = {
  title: "Products",
  description:
    "Browse Catelina's curated fashion collection, including sarees, kurtis, dresses, and everyday styles.",
  alternates: {
    canonical: "/products",
  },
  openGraph: {
    title: "Products | catelina.in",
    description:
      "Browse Catelina's curated fashion collection, including sarees, kurtis, dresses, and everyday styles.",
    url: "/products",
    siteName: "catelina.in",
    locale: "en_IN",
    type: "website",
  },
};

const Products = () => {
  return (
    <Suspense fallback={<p>Loading products...</p>}>
      <ProductsClient />
    </Suspense>
  );
};

export default Products;
