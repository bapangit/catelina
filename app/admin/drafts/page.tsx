"use client";

import { useEffect, useState } from "react";

interface Product {
  _id: string;
  title: string;
  price: string;
  image: string;
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
            <div
              key={product._id}
              style={{
                border: "1px solid #ddd",
                borderRadius: "10px",
                padding: "15px",
              }}
            >
              {product.image && product.image.startsWith("http") ? (
                <img
                  src={product.image}
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
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Drafts;