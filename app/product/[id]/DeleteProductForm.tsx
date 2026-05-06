"use client";

import { useFormStatus } from "react-dom";
import styles from "./page.module.css";

type DeleteProductFormProps = {
  action: (formData: FormData) => void | Promise<void>;
  productId: string;
  productTitle?: string;
};

function DeleteButton() {
  const { pending } = useFormStatus();

  return (
    <button className={styles.deleteProductButton} disabled={pending} type="submit">
      {pending ? "Deleting..." : "Delete Product"}
    </button>
  );
}

export default function DeleteProductForm({
  action,
  productId,
  productTitle,
}: DeleteProductFormProps) {
  return (
    <form
      action={action}
      onSubmit={(event) => {
        const productName = productTitle || "this product";
        const confirmed = window.confirm(
          `Delete ${productName}? This cannot be undone.`
        );

        if (!confirmed) {
          event.preventDefault();
        }
      }}
    >
      <input name="productId" type="hidden" value={productId} />
      <DeleteButton />
    </form>
  );
}
