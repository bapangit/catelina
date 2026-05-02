"use client";

import { use, useState, ChangeEvent, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import styles from "./page.module.css";
import {
  careInstructionOptions,
  closureOptions,
  dressShapeOptions,
  dressesSubcategoryOptions,
  fabricOptions,
  fitOptions,
  necklineOptions,
  occasionOptions,
  packSizeOptions,
  patternOptions,
  sleeveStyleOptions,
} from "@/config/productInfoOpt";

type AddProductPageProps = {
  searchParams: Promise<{ id?: string | string[] }>;
};

const AddProduct = ({ searchParams }: AddProductPageProps) => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const resolvedSearchParams = use(searchParams);
  const draftId =
    typeof resolvedSearchParams.id === "string"
      ? resolvedSearchParams.id
      : Array.isArray(resolvedSearchParams.id)
        ? resolvedSearchParams.id[0]
        : undefined;

  useEffect(() => {
    if (status === 'loading') return; // Still loading
    if (!session || session.user.role !== 'admin') {
      router.push('/'); // Redirect to home or unauthorized page
    }
  }, [session, status, router]);

  const [productId, setProductId] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [prevPrice, setPrevPrice] = useState("");
  const [fabric, setFabric] = useState("");
  const [pattern, setPattern] = useState("");
  const [occasion, setOccasion] = useState("");
  const [fit, setFit] = useState("");
  const [neckline, setNeckline] = useState("");
  const [closure, setClosure] = useState("");
  const [packSize, setPackSize] = useState("");
  const [dressesSubcategory, setDressesSubcategory] = useState("");
  const [sleeveStyle, setSleeveStyle] = useState("");
  const [dressShape, setDressShape] = useState("");
  const [careInstructions, setCareInstructions] = useState("");
  const [preview, setPreview] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [uploading, setUploading] = useState(false);

  const [preview2, setPreview2] = useState("");
  const [imageUrl2, setImageUrl2] = useState("");
  const [uploading2, setUploading2] = useState(false);
  const [saving, setSaving] = useState<"draft" | "publish" | null>(null);

  useEffect(() => {
    const initializeProduct = async () => {
      try {
        if (draftId) {
          const res = await fetch(`/api/products/create-product/${draftId}`);
          const data = await res.json();

          if (data.success && data.product) {
            setProductId(data.product._id || draftId);
            setTitle(data.product.title || "");
            setDescription(data.product.description || "");
            setPrice(data.product.price || "");
            setPrevPrice(data.product.prevPrice || "");
            setFabric(data.product.fabric || "");
            setPattern(data.product.pattern || "");
            setOccasion(data.product.occasion || "");
            setFit(data.product.fit || "");
            setNeckline(data.product.neckline || "");
            setClosure(data.product.closure || "");
            setPackSize(data.product.packSize || "");
            setDressesSubcategory(data.product.dressesSubcategory || "");
            setSleeveStyle(data.product.sleeveStyle || "");
            setDressShape(data.product.dressShape || "");
            setCareInstructions(data.product.careInstructions || "");
            setImageUrl(data.product.image1 || "");
            setPreview(data.product.image1 || "");
            setImageUrl2(data.product.image2 || "");
            setPreview2(data.product.image2 || "");
            return;
          }
        }

        const res = await fetch("/api/products/create-draft", {
          method: "POST",
        });
        const data = await res.json();

        if (data.success) {
          setProductId(data.product._id);
        }
      } catch (error) {
        console.log(error);
      }
    };

    initializeProduct();
  }, [draftId]);

  /* HANDLE IMAGE CHANGE | SAVE TO DRAFT */
  const handleImageChange = async (
    e: ChangeEvent<HTMLInputElement>,
    index: number,
  ) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (index == 1) {
      setPreview(URL.createObjectURL(file));
    } else if (index == 2) {
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
            [`image${index}`]: data.secure_url,
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
  const saveProduct = async (published: boolean) => {
    const saveMode = published ? "publish" : "draft";

    try {
      setSaving(saveMode);

      const response = await fetch(
        `/api/products/create-product/${productId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title,
            description:description,
            price,
            prevPrice,
            fabric,
            pattern,
            occasion,
            fit,
            neckline,
            closure,
            packSize,
            dressesSubcategory,
            sleeveStyle,
            dressShape,
            careInstructions,
            image1: imageUrl,
            image2: imageUrl2,
            published,
          }),
        },
      );

      const data = await response.json();

      if (data.success) {
        alert(published ? "Product published" : "Product saved to draft");
        console.log(data.product);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setSaving(null);
    }
  };

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  if (!session || session.user.role !== 'admin') {
    return <div>Access Denied</div>;
  }


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
        <label>Product Description</label>

        <input
          type="text"
          placeholder="Enter product Sescription"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
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
        <label>Prev Price</label>

        <input
          type="number"
          placeholder="Enter product prev price"
          value={prevPrice}
          onChange={(e) => setPrevPrice(e.target.value)}
        />
      </div>

      <div className={styles.formGroup}>
        <label>Material</label>

        <select value={fabric} onChange={(e) => setFabric(e.target.value)}>
          <option value="">Select material</option>
          {fabricOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>

      <div className={styles.infoSection}>
        <h3 className={styles.sectionTitle}>Product Information</h3>
        <div className={styles.infoGrid}>
          <div className={styles.formGroup}>
            <label>Pattern</label>
            <select value={pattern} onChange={(e) => setPattern(e.target.value)}>
              <option value="">Select pattern</option>
              {patternOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.formGroup}>
            <label>Occasion</label>
            <select value={occasion} onChange={(e) => setOccasion(e.target.value)}>
              <option value="">Select occasion</option>
              {occasionOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.formGroup}>
            <label>Fit</label>
            <select value={fit} onChange={(e) => setFit(e.target.value)}>
              <option value="">Select fit</option>
              {fitOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.formGroup}>
            <label>Neckline</label>
            <select value={neckline} onChange={(e) => setNeckline(e.target.value)}>
              <option value="">Select neckline</option>
              {necklineOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.formGroup}>
            <label>Closure</label>
            <select value={closure} onChange={(e) => setClosure(e.target.value)}>
              <option value="">Select closure</option>
              {closureOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.formGroup}>
            <label>Pack Size</label>
            <select value={packSize} onChange={(e) => setPackSize(e.target.value)}>
              <option value="">Select pack size</option>
              {packSizeOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.formGroup}>
            <label>Dresses Subcategory</label>
            <select
              value={dressesSubcategory}
              onChange={(e) => setDressesSubcategory(e.target.value)}
            >
              <option value="">Select subcategory</option>
              {dressesSubcategoryOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.formGroup}>
            <label>Sleeve Style</label>
            <select
              value={sleeveStyle}
              onChange={(e) => setSleeveStyle(e.target.value)}
            >
              <option value="">Select sleeve style</option>
              {sleeveStyleOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.formGroup}>
            <label>Dress Shape</label>
            <select
              value={dressShape}
              onChange={(e) => setDressShape(e.target.value)}
            >
              <option value="">Select dress shape</option>
              {dressShapeOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.formGroup}>
            <label>Care Instructions</label>
            <select
              value={careInstructions}
              onChange={(e) => setCareInstructions(e.target.value)}
            >
              <option value="">Select care instructions</option>
              {careInstructionOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

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
      <div className={styles.buttonRow}>
        <button
          type="button"
          onClick={() => saveProduct(false)}
          className={`${styles.button} ${styles.secondaryButton}`}
          disabled={saving !== null}
        >
          {saving === "draft" ? "Saving Draft..." : "Save to Draft"}
        </button>
        <button
          type="button"
          onClick={() => saveProduct(true)}
          className={styles.button}
          disabled={saving !== null}
        >
          {saving === "publish" ? "Publishing..." : "Publish"}
        </button>
      </div>
    </>
  );
};

export default AddProduct;
