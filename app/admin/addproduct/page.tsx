"use client";

import { useState, ChangeEvent, useEffect } from "react";
import styles from "./page.module.css";

const AddProduct = () => {
  const [productId, setProductId] = useState("");
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const createDraftProduct = async () => {
      try {
        const res = await fetch("/api/products/create-draft", {
          method: "POST",
        });

        const data = await res.json();

        console.log("data -----------------------",data);
        

        if (data.success) {
          setProductId(data.product._id);
        }
      } catch (error) {
        console.log(error);
      }
    };

    if (!productId) {
      createDraftProduct();
    }
  }, [productId]);

  const handleImageChange = async (
    e: ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setImage(file);
    setPreview(URL.createObjectURL(file));

    try {
      setUploading(true);

      const formData = new FormData();

      formData.append("file", file);
      formData.append(
        "upload_preset",
        process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!
      );

      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await res.json();

      if (data.secure_url) {
        setImageUrl(data.secure_url);

        // optional save to db instantly
        await fetch(`/api/products/${productId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            image: data.secure_url,
          }),
        });
      }
    } catch (error) {
      console.log(error);
    } finally {
      setUploading(false);
    }
  };

  const saveProduct = async () => {
  try {
    const response = await fetch(`/api/products/create-product/${productId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title,
        price,
        image: preview,
      }),
    });

    const data = await response.json();

    if (data.success) {
      alert("Product Saved");
      console.log(data.product);
    }
  } catch (error) {
    console.log(error);
  }
};

  return (
    <>
      <h2>Add New Product</h2>

      <p>Product ID: {productId}</p>

      <div className={styles.formGroup}>
        <label>Product Title</label>

        <input
          type="text"
          placeholder="Enter product title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>

      <div className={styles.formGroup}>
        <label>Price</label>

        <input
          type="number"
          placeholder="Enter product price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />
      </div>

      <div className={styles.formGroup}>
        <label>Product Image</label>

        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
        />
      </div>

      {uploading && <p>Uploading image...</p>}

      {preview && (
        <div className={styles.previewBox}>
          <img
            src={preview}
            alt="Preview"
            className={styles.previewImage}
          />
        </div>
      )}

      {imageUrl && (
        <div>
          <p>Uploaded Successfully</p>
          <p>{imageUrl}</p>
        </div>
      )}

      <button onClick={saveProduct}  className={styles.button}>
        Add Product
      </button>
    </>
  );
};

export default AddProduct;