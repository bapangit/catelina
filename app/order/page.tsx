import ProductImageSlider from "@/app/components/ProductImageSlider";
import connectDB from "@/config/DBConnect";
import Product from "@/config/models/product";
import mongoose from "mongoose";
import { notFound } from "next/navigation";
import styles from "./page.module.css";

type OrderPageProps = {
  searchParams: Promise<{
    productId?: string;
    size?: string;
  }>;
};

type ProductRecord = {
  _id: string;
  title?: string;
  price?: string;
  image1?: string;
  image2?: string;
  image3?: string;
  image4?: string;
  image5?: string;
};

const DELIVERY_FEE = 98;
const availableSizes = ["S", "M", "L"];

const parsePrice = (value?: string) => {
  const price = Number((value || "").replace(/[^0-9.]/g, ""));

  return Number.isFinite(price) ? price : 0;
};

const formatPrice = (value: number) => `Rs. ${value.toFixed(2)}`;

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

export default async function OrderPage({ searchParams }: OrderPageProps) {
  const { productId, size } = await searchParams;

  if (!productId || !size || !availableSizes.includes(size)) {
    notFound();
  }

  const product = await getProductById(productId);

  if (!product) {
    notFound();
  }

  const productPrice = parsePrice(product.price);
  const totalPrice = productPrice + DELIVERY_FEE;

  return (
    <main className={styles.pageShell}>
      <section className={styles.container}>
        <h1 className={styles.heading}>Order Summary</h1>

        <div className={styles.summaryGrid}>
          <div className={styles.productPanel}>
            <div className={styles.imageWrapper}>
              <ProductImageSlider
                image1={product.image1}
                image2={product.image2}
                image3={product.image3}
                image4={product.image4}
                image5={product.image5}
                alt={product.title || "Product image"}
                height="100%"
                borderRadius="8px"
              />
            </div>
            <div className={styles.productInfo}>
              <h2>{product.title || "Untitled Product"}</h2>
              <p>Size: {size}</p>
            </div>
          </div>

          <aside className={styles.pricePanel}>
            <h2>Price Details</h2>
            <div className={styles.priceLine}>
              <span>Product Price</span>
              <span>{formatPrice(productPrice)}</span>
            </div>
            <div className={styles.priceLine}>
              <span>Delivery Fee</span>
              <span>{formatPrice(DELIVERY_FEE)}</span>
            </div>
            <div className={styles.totalLine}>
              <span>Total</span>
              <span>{formatPrice(totalPrice)}</span>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}
