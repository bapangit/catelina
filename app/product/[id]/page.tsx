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
      <h1 className={styles.title}>{product.title || "Untitled Product"}</h1>
      <div className={styles.image}>
        <ProductImageSlider
          image1={product.image1}
          image2={product.image2}
          alt={product.title || "Product image"}
          height="400px"
          borderRadius="8px"
        />
      </div>
      <p className={styles.price}>INR {product.price || "0"}</p>
    </div>
  );
}
