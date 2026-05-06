import ProductImageSlider from "@/app/components/ProductImageSlider";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import connectDB from "@/config/DBConnect";
import Product from "@/config/models/product";
import { deleteFromCloudinary } from "@/lib/cloudinary";
import mongoose from "mongoose";
import type { Metadata } from "next";
import { revalidatePath } from "next/cache";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { notFound, redirect } from "next/navigation";
import { cache } from "react";
import DeleteProductForm from "./DeleteProductForm";
import OrderControls from "./OrderControls";
import styles from "./page.module.css";

type ProductPageProps = {
  params: Promise<{ id: string }>;
};

type ProductRecord = {
  _id: string;
  title?: string;
  price?: string;
  prevPrice?: string;
  category?: string;
  description?: string;
  image1?: string;
  image2?: string;
  image3?: string;
  image4?: string;
  image5?: string;
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

type ProductImages = Pick<
  ProductRecord,
  "image1" | "image2" | "image3" | "image4" | "image5"
>;

const getProductById = cache(async (id: string): Promise<ProductRecord | null> => {
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
});

const getProductImageUrls = (product: ProductImages) =>
  [
    product.image1,
    product.image2,
    product.image3,
    product.image4,
    product.image5,
  ].filter((imageUrl): imageUrl is string =>
    Boolean(imageUrl && imageUrl.trim() && imageUrl.startsWith("http"))
  );

const parsePrice = (value?: string) => {
  const price = Number((value || "").replace(/[^0-9.]/g, ""));

  return Number.isFinite(price) ? price : 0;
};

const getDiscountPercentage = (prevPrice?: string, price?: string) => {
  const previous = parsePrice(prevPrice);
  const current = parsePrice(price);

  if (!previous || !current || current >= previous) {
    return null;
  }

  return Math.round(((previous - current) / previous) * 100);
};

async function deleteProduct(formData: FormData) {
  "use server";

  const session = await getServerSession(authOptions);
  const productId = formData.get("productId");

  if (!session?.user || session.user.role !== "admin") {
    throw new Error("Only admins can delete products.");
  }

  if (typeof productId !== "string" || !mongoose.Types.ObjectId.isValid(productId)) {
    throw new Error("Invalid product.");
  }

  await connectDB();

  const product = await Product.findById(productId).lean<ProductImages | null>();

  if (!product) {
    notFound();
  }

  const imageUrls = getProductImageUrls(product);

  await Promise.all(imageUrls.map((imageUrl) => deleteFromCloudinary(imageUrl)));
  await Product.findByIdAndDelete(productId);

  revalidatePath("/");
  revalidatePath("/products");
  revalidatePath("/most-ordered");
  revalidatePath(`/product/${productId}`);
  redirect("/products");
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { id } = await params;
  const product = await getProductById(id);
  const productTitle = product?.title || "Product";
  const productDescription = product?.description?.trim();
  const shortDescription =
    productDescription && productDescription.length > 80
      ? `${productDescription.slice(0, 77).trim()}...`
      : productDescription;

  return {
    title: shortDescription
      ? `${productTitle} - ${shortDescription}`
      : productTitle,
    description: productDescription || `Shop ${productTitle} at catelina.in`,
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params;
  const product = await getProductById(id);

  if (!product) {
    notFound();
  }

  const session = await getServerSession(authOptions);
  const isAdmin = session?.user?.role === "admin";
  const productDetails = [
    { label: "Category", value: product.category },
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
  const discountPercentage = getDiscountPercentage(
    product.prevPrice,
    product.price
  );

  return (
    <div className={styles.container}>
      <div className={styles.productWrapper}>
        <div className={styles.imageWrapper}>
          <ProductImageSlider
            image1={product.image1}
            image2={product.image2}
            image3={product.image3}
            image4={product.image4}
            image5={product.image5}
            alt={product.title || "Product image"}
            height="100%"
            borderRadius="12px"
          />
        </div>
        <div className={styles.details}>
          <div className={styles.headerRow}>
            <h1 className={styles.title}>{product.title || "Untitled Product"}</h1>
            {isAdmin ? (
              <div className={styles.adminActions}>
                <Link
                  className={styles.editProductButton}
                  href={`/admin/addproduct?id=${product._id}`}
                >
                  Edit Product
                </Link>
                <DeleteProductForm
                  action={deleteProduct}
                  productId={product._id}
                  productTitle={product.title}
                />
              </div>
            ) : null}
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
              {discountPercentage !== null ? (
                <span className={styles.discountText}>
                  {discountPercentage}% OFF
                </span>
              ) : null}
            </div>
            <span className={styles.taxText}>MRP inclusive of all taxes</span>
          </div>
          <OrderControls productId={product._id} />
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
