"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

interface Product {
  _id: string;
  title: string;
  price: string;
  image1?: string;
  image2?: string;
}

const Drafts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDrafts();
  }, []);

  const fetchDrafts = async () => {
    try {
      const res = await fetch("/api/products/drafts");
      console.log("drafts----------------",res);
      
      const data = await res.json();

      setProducts(data.products || []);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <h2>Loading...</h2>;
  }

  return (
    <div style={{ padding: "20px" }}>
      <h1>Draft Products</h1>

      {products.length === 0 ? (
        <p>No draft products found</p>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill,minmax(250px,1fr))",
            gap: "20px",
            marginTop: "20px",
          }}
        >
          {products.map((product) => (
            <Link
              key={product._id}
              href={`/admin/addproduct?id=${product._id}`}
              style={{
                display: "block",
                border: "1px solid #ddd",
                borderRadius: "10px",
                padding: "15px",
                color: "inherit",
                textDecoration: "none",
                cursor: "pointer",
              }}
            >
              {(product.image1 || product.image2)?.startsWith("http") ? (
                <img
                  src={product.image1 || product.image2 || ""}
                  alt={product.title}
                  style={{
                    width: "100%",
                    height: "200px",
                    objectFit: "cover",
                    borderRadius: "10px",
                  }}
                />
              ) : (
                <div
                  style={{
                    width: "100%",
                    height: "200px",
                    display: "grid",
                    placeItems: "center",
                    background: "#f3f4f6",
                    color: "#64748b",
                    borderRadius: "10px",
                  }}
                >
                  No image
                </div>
              )}

              <h3>{product.title || "Untitled Product"}</h3>

              <p>₹ {product.price || "0"}</p>

              <p
                style={{
                  color: "orange",
                  fontWeight: "bold",
                }}
              >
                Draft
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default Drafts;
