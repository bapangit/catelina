"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import ProductImageSlider from "../components/ProductImageSlider";
import { dressCategories } from "@/config/productInfoOpt";
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
  const [category, setCategory] = useState("");
  const [searchText, setSearchText] = useState("");
  const [debouncedSearchText, setDebouncedSearchText] = useState("");
  const observer = useRef<IntersectionObserver | null>(null);

  const loadProducts = useCallback(async (
    pageNumber: number,
    categoryFilter: string,
    searchFilter: string
  ) => {
    try {
      if (pageNumber === 1) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }

      const params = new URLSearchParams({
        page: String(pageNumber),
        limit: String(PAGE_SIZE),
      });

      if (categoryFilter) {
        params.set("category", categoryFilter);
      }

      if (searchFilter.trim()) {
        params.set("search", searchFilter.trim());
      }

      const response = await fetch(
        `/api/products/published?${params.toString()}`
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
  }, []);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setDebouncedSearchText(searchText);
    }, 350);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [searchText]);

  useEffect(() => {
    setPage(1);
    loadProducts(1, category, debouncedSearchText);
  }, [category, debouncedSearchText, loadProducts]);

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
    loadProducts(page, category, debouncedSearchText);
  }, [category, debouncedSearchText, loadProducts, page]);

  return (
    <div className={styles.productsPage}>
      <aside className={styles.filterSection}>
        <h2>Filters</h2>
        <div className={styles.filterGroup}>
          <label htmlFor="product-search">Search</label>
          <input
            id="product-search"
            type="search"
            value={searchText}
            placeholder="Search products"
            onChange={(event) => setSearchText(event.target.value)}
          />
        </div>

        <div className={styles.filterGroup}>
        <label htmlFor="category-filter">Category</label>
        <select
          id="category-filter"
          value={category}
          onChange={(event) => setCategory(event.target.value)}
        >
          <option value="">All categories</option>
          {dressCategories.map((option) => (
            <option key={option.name} value={option.name}>
              {option.name}
            </option>
          ))}
        </select>
        </div>
      </aside>

      <section className={styles.productsContent}>
        {error && <p className={styles.errorText}>{error}</p>}

        <div className={styles.productsGrid}>
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
              >
                <Link href={`/product/${product._id}`} className={styles.productLink}>
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
                    <div className={styles.priceRow}>
                      {product.prevPrice && (
                        <span className={styles.prevPrice}>
                          INR {product.prevPrice}
                        </span>
                      )}
                      <p>INR {product.price || "0"}</p>
                      {discountPercentage !== null && (
                        <span className={styles.discountText}>
                          ({discountPercentage}% off)
                        </span>
                      )}
                    </div>
                    <p className={styles.productDescription}>
                      {product.description || "No description available"}
                    </p>
                  </div>
                </Link>
              </div>
            );
          })}
        </div>

        {loading && <h2 className={styles.statusText}>Loading products...</h2>}
        {loadingMore && (
          <p className={styles.statusText}>Loading more products...</p>
        )}
        {!loading && products.length === 0 && (
          <p className={styles.statusText}>No published products found.</p>
        )}
        {!hasMore && products.length > 0 && (
          <p className={styles.endText}>
            You have reached the end of the products list.
          </p>
        )}
      </section>
    </div>
  );
};

export default Products;
