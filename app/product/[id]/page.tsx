import ProductImageSlider from "@/app/components/ProductImageSlider";
import connectDB from "@/config/DBConnect";
import Product from "@/config/models/product";
import mongoose from "mongoose";
import { notFound } from "next/navigation";
import styles from "./page.module.css";

type ProductPageProps = {
  params: Promise<{ id: string }>;
};

type ProductRecord = {
  _id: string;
  title?: string;
  price?: string;
  description?: string;
  image1?: string;
  image2?: string;
};

async function getProductById(id: string): Promise<ProductRecord | null> {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return null;
  }

  await connectDB();

  const product = await Product.findById(id).lean<ProductRecord | null>();

  if (!product) {
    return null;
  }

  return {
    ...product,
    _id: String(product._id),
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params;
  const product = await getProductById(id);

  if (!product) {
    notFound();
  }

  return (
    <div className={styles.container}>
      <div className={styles.productWrapper}>
        <div className={styles.imageWrapper}>
          <ProductImageSlider
            image1={product.image1}
            image2={product.image2}
            alt={product.title || "Product image"}
            height="500px"
            borderRadius="12px"
          />
        </div>
        <div className={styles.details}>
          <div className={styles.headerRow}>
            <h1 className={styles.title}>{product.title || "Untitled Product"}</h1>
          </div>
          <p className={styles.description}>{product.description || "No description available."}</p>
          <div className={styles.priceRow}>
            <p className={styles.price}>₹{product.price || "0"}</p>
            <span className={styles.taxText}>MRP inclusive of all taxes</span>
          </div>
          <div className={styles.optionSection}>
            <div className={styles.optionTitle}>Select Size</div>
            <div className={styles.sizeButtons}>
              <button type="button" className={styles.sizeButton}>S</button>
              <button type="button" className={styles.sizeButton}>M</button>
              <button type="button" className={styles.sizeButton}>L</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
