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

  const [image2, setImage2] = useState<File | null>(null);
  const [preview2, setPreview2] = useState("");
  const [imageUrl2, setImageUrl2] = useState("");
  const [uploading2, setUploading2] = useState(false);

  useEffect(() => {
    /* CREATE DRAFT */
    const createDraftProduct = async () => {
      try {
        console.log("-------------1");

        const res = await fetch("/api/products/create-draft", {
          method: "POST",
        });
        console.log("-------------2", res);
        const data = await res.json();

        console.log("data--------------------------", data);

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
  }, []);

  /* HANDLE IMAGE CHANGE | SAVE TO DRAFT */
  const handleImageChange = async (
    e: ChangeEvent<HTMLInputElement>,
    index: number,
  ) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (index == 1) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    } else if (index == 2) {
      setImage2(file);
      setPreview2(URL.createObjectURL(file));
    }

    try {
      if (index == 1) {
        setUploading(true);
      } else if (index == 2) {
        setUploading2(true);
      }

      const formData = new FormData();

      formData.append("file", file);
      formData.append(
        "upload_preset",
        process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!,
      );

      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: "POST",
          body: formData,
        },
      );

      const data = await res.json();
      console.log("upload data", data);
      if (data.secure_url) {
        if (index == 1) {
          setImageUrl(data.secure_url);
        } else if (index == 2) {
          setImageUrl2(data.secure_url);
        }

        // optional save to db instantly
        await fetch(`/api/products/create-product/${productId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ["image" + index]: data.secure_url,
          }),
        })
          .then(() => {
            "image url saved";
          })
          .catch((e) => {
            console.log("e", e);
          });
      }
    } catch (error) {
      console.log(error);
    } finally {
      if (index == 1) {
        setUploading(false);
      } else if (index == 2) {
        setUploading2(false);
      }
    }
  };

  /* SAVE PRODUCT */
  const saveProduct = async () => {
    try {
      const response = await fetch(
        `/api/products/create-product/${productId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title,
            price,
            image: imageUrl,
            published: true,
          }),
        },
      );

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
      // image 1 //
      <div className={styles.formGroup}>
        <label>Product Image1</label>

        <input
          type="file"
          accept="image/*"
          onChange={(e) => {
            handleImageChange(e, 1);
          }}
        />
      </div>
      {uploading && <p>Uploading image...</p>}
      {preview && (
        <div className={styles.previewBox}>
          <img src={preview} alt="Preview" className={styles.previewImage} />
        </div>
      )}
      {imageUrl && (
        <div>
          <p>Uploaded Successfully</p>
          <p>{imageUrl}</p>
        </div>
      )}
      // image 2 //
      <div className={styles.formGroup}>
        <label>Product Image2</label>

        <input
          type="file"
          accept="image/*"
          onChange={(e) => {
            handleImageChange(e, 2);
          }}
        />
      </div>
      {uploading2 && <p>Uploading image...</p>}
      {preview2 && (
        <div className={styles.previewBox}>
          <img src={preview2} alt="Preview" className={styles.previewImage} />
        </div>
      )}
      {imageUrl2 && (
        <div>
          <p>Uploaded Successfully</p>
          <p>{imageUrl2}</p>
        </div>
      )}
      <button onClick={saveProduct} className={styles.button}>
        Add Product
      </button>
    </>
  );
};

export default AddProduct;
