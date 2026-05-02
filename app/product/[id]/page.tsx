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
  prevPrice?: string;
  description?: string;
  image1?: string;
  image2?: string;
  fabric?: string;
  pattern?: string;
  occasion?: string;
  fit?: string;
  neckline?: string;
  closure?: string;
  packSize?: string;
  dressesSubcategory?: string;
  sleeveStyle?: string;
  dressShape?: string;
  careInstructions?: string;
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

  const productDetails = [
    { label: "Material", value: product.fabric },
    { label: "Pattern", value: product.pattern },
    { label: "Occasion", value: product.occasion },
    { label: "Fit", value: product.fit },
    { label: "Neckline", value: product.neckline },
    { label: "Closure", value: product.closure },
    { label: "Pack Size", value: product.packSize },
    { label: "Dresses Subcategory", value: product.dressesSubcategory },
    { label: "Sleeve Style", value: product.sleeveStyle },
    { label: "Dress Shape", value: product.dressShape },
  ].filter((detail) => Boolean(detail.value));

  const hasProductInfo =
    productDetails.length > 0 || Boolean(product.careInstructions);

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
          <p className={styles.description}>
            {product.description || "No description available."}
          </p>
          <div className={styles.priceRow}>
            <div className={styles.priceLine}>
              <p className={styles.price}>Rs. {product.price || "0"}</p>
              {product.prevPrice ? (
                <p className={styles.prevPrice}>Rs. {product.prevPrice}</p>
              ) : null}
            </div>
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
          {hasProductInfo ? (
            <section className={styles.infoSection}>
              <h2 className={styles.infoHeading}>Product Information</h2>
              <div className={styles.infoCard}>
                <h3 className={styles.infoTitle}>Product details</h3>
                {productDetails.length > 0 ? (
                  <div className={styles.infoGrid}>
                    {productDetails.map((detail) => (
                      <div key={detail.label} className={styles.infoItem}>
                        <span className={styles.infoLabel}>{detail.label}</span>
                        <span className={styles.infoValue}>{detail.value}</span>
                      </div>
                    ))}
                  </div>
                ) : null}
                {product.careInstructions ? (
                  <div className={styles.careSection}>
                    <span className={styles.infoLabel}>Care Instructions</span>
                    <span className={styles.infoValue}>
                      {product.careInstructions}
                    </span>
                  </div>
                ) : null}
              </div>
            </section>
          ) : null}
        </div>
      </div>
    </div>
  );
}
