"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import styles from "./page.module.css";

type OrderControlsProps = {
  productId: string;
};

const sizes = ["S", "M", "L"];

export default function OrderControls({ productId }: OrderControlsProps) {
  const router = useRouter();
  const [selectedSize, setSelectedSize] = useState("");

  const openOrderPage = () => {
    if (!selectedSize) {
      return;
    }

    const params = new URLSearchParams({
      productId,
      size: selectedSize,
    });

    router.push(`/order?${params.toString()}`);
  };

  return (
    <div className={styles.optionSection}>
      <div className={styles.optionTitle}>Select Size</div>
      <div className={styles.sizeButtons}>
        {sizes.map((size) => (
          <button
            aria-pressed={selectedSize === size}
            className={`${styles.sizeButton} ${
              selectedSize === size ? styles.selectedSizeButton : ""
            }`}
            key={size}
            onClick={() => setSelectedSize(size)}
            type="button"
          >
            {size}
          </button>
        ))}
      </div>
      <button
        className={styles.orderButton}
        disabled={!selectedSize}
        onClick={openOrderPage}
        type="button"
      >
        Order
      </button>
    </div>
  );
}
