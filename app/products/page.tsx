"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import ProductImageSlider from "../components/ProductImageSlider";
import styles from "./page.module.css";

interface Product {
  _id: string;
  title: string;
  description:string;
  price: string;
  prevPrice: string;
  category: string;
  image1: string;
  image2: string;
  image3: string;
  image4: string;
  image5: string;
}

const PAGE_SIZE = 8;

const parsePrice = (value: string) => {
  const price = Number(value.replace(/[^0-9.]/g, ""));

  return Number.isFinite(price) ? price : 0;
};

const getDiscountPercentage = (prevPrice: string, price: string) => {
  const previous = parsePrice(prevPrice);
  const current = parsePrice(price);

  if (!previous || !current || current >= previous) {
    return null;
  }

  return Math.round(((previous - current) / previous) * 100);
};

const Products = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState("");
  const observer = useRef<IntersectionObserver | null>(null);

  const loadProducts = async (pageNumber: number) => {
    try {
      if (pageNumber === 1) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }

      const response = await fetch(
        `/api/products/published?page=${pageNumber}&limit=${PAGE_SIZE}`
      );
      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data?.message || "Unable to load products");
      }

      setProducts((prev) =>
        pageNumber === 1 ? data.products : [...prev, ...data.products]
      );
      setHasMore(Boolean(data.hasMore));
    } catch (err) {
      console.error("Published products fetch error:", err);
      setError("Could not load products. Please try again later.");
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    loadProducts(1);
  }, []);

  const lastProductRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (loadingMore) return;
      if (observer.current) {
        observer.current.disconnect();
      }
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prev) => prev + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [loadingMore, hasMore]
  );

  useEffect(() => {
    if (page === 1) return;
    loadProducts(page);
  }, [page]);

  return (
    <div style={{ padding: "20px" }}>
      {error && (
        <p style={{ color: "#b91c1c", marginTop: "12px" }}>{error}</p>
      )}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill,minmax(250px,1fr))",
          gap: "20px",
          marginTop: "20px",
        }}
      >
        {products.map((product, index) => {
          const isLastItem = index === products.length - 1;
          const discountPercentage = getDiscountPercentage(
            product.prevPrice,
            product.price
          );

          return (
            <div
              key={product._id}
              ref={isLastItem ? lastProductRef : null}
              className={styles.productCard}
              style={{
                padding: "15px",
                minHeight: "320px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <Link
                href={`/product/${product._id}`}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  flex: 1,
                  color: "inherit",
                  textDecoration: "none",
                }}
              >
                <ProductImageSlider
                  image1={product.image1}
                  image2={product.image2}
                  image3={product.image3}
                  image4={product.image4}
                  image5={product.image5}
                  alt={product.title || "Product image"}
                  height="auto"
                  aspectRatio="3 / 4"
                  borderRadius="0"
                />

                <div>
                  <h3>{product.title || "Untitled Product"}</h3>
                  <div style={{ margin: "8px 0" }}>
                    {product.prevPrice && (
                      <span style={{ textDecoration: "line-through", color: "#999", fontSize: "0.9rem", marginRight: "8px" }}>
                        INR {product.prevPrice}
                      </span>
                    )}
                    <p style={{ fontSize: "1rem", display: "inline" }}>
                      INR {product.price || "0"}
                    </p>
                    {discountPercentage !== null && (
                      <span style={{ color: "#16a34a", fontSize: "0.9rem", marginLeft: "8px", fontWeight: 600 }}>
                        ({discountPercentage}% off)
                      </span>
                    )}
                  </div>
                  <p style={{ fontSize: "0.9rem", color: "#666", margin: "8px 0" }}>
                    {product.description || "No description available"}
                  </p>
                </div>
              </Link>
            </div>
          );
        })}
      </div>

      {loading && <h2 style={{ marginTop: "20px" }}>Loading products...</h2>}
      {loadingMore && (
        <p style={{ marginTop: "20px" }}>Loading more products...</p>
      )}
      {!loading && products.length === 0 && (
        <p style={{ marginTop: "20px" }}>No published products found.</p>
      )}
      {!hasMore && products.length > 0 && (
        <p style={{ marginTop: "20px", color: "#475569" }}>
          You have reached the end of the products list.
        </p>
      )}
    </div>
  );
};

export default Products;
