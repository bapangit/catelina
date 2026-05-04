import ProductImageSlider from "@/app/components/ProductImageSlider";
import connectDB from "@/config/DBConnect";
import Address from "@/config/models/address";
import Product from "@/config/models/product";
import User from "@/config/models/user";
import mongoose from "mongoose";
import { getServerSession } from "next-auth";
import Link from "next/link";
import { notFound } from "next/navigation";
import { authOptions } from "../api/auth/[...nextauth]/route";
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

type AddressRecord = {
  _id: string;
  name?: string;
  ph?: string;
  pin?: string;
  at?: string;
  po?: string;
  dist?: string;
  state?: string;
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

async function getSelectedAddress(): Promise<AddressRecord | null> {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return null;
  }

  await connectDB();

  const user = await User.findOne({ email: session.user.email });
  const selectedAddressId = user?.selectedAddress
    ? String(user.selectedAddress)
    : "";

  if (!user || !mongoose.Types.ObjectId.isValid(selectedAddressId)) {
    return null;
  }

  const address = await Address.findOne({
    _id: selectedAddressId,
    userId: String(user._id),
  }).lean<AddressRecord | null>();

  if (!address) {
    return null;
  }

  return {
    ...address,
    _id: String(address._id),
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
  const selectedAddress = await getSelectedAddress();
  const orderPath = `/order?${new URLSearchParams({
    productId,
    size,
  }).toString()}`;
  const addressPath = `/address?${new URLSearchParams({
    returnTo: orderPath,
  }).toString()}`;

  return (
    <main className={styles.pageShell}>
      <section className={styles.container}>
        <h1 className={styles.heading}>Order Summary</h1>

        <div className={styles.summaryGrid}>
          <div className={styles.detailsColumn}>
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

            <section className={styles.addressPanel}>
              <div className={styles.panelHeader}>
                <h2>Delivery Address</h2>
                <Link className={styles.changeLink} href={addressPath}>
                  Change
                </Link>
              </div>
              {selectedAddress ? (
                <div className={styles.addressDetails}>
                  <h3>{selectedAddress.name || "Unnamed address"}</h3>
                  <p>{selectedAddress.at}</p>
                  <p>
                    {selectedAddress.po}, {selectedAddress.dist}
                  </p>
                  <p>
                    {selectedAddress.state} - {selectedAddress.pin}
                  </p>
                  <p>Phone: {selectedAddress.ph}</p>
                </div>
              ) : (
                <div className={styles.emptyAddress}>
                  <p>No delivery address selected.</p>
                  <Link className={styles.primaryLink} href={addressPath}>
                    Select Address
                  </Link>
                </div>
              )}
            </section>
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
