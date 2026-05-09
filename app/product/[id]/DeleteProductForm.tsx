"use client";

import { useFormStatus } from "react-dom";
import styles from "./page.module.css";

type DeleteProductFormProps = {
  action: (formData: FormData) => void | Promise<void>;
  disabled?: boolean;
  productId: string;
  productTitle?: string;
};

function DeleteButton({ disabled = false }: { disabled?: boolean }) {
  const { pending } = useFormStatus();

  return (
    <button
      className={styles.deleteProductButton}
      disabled={disabled || pending}
      type="submit"
    >
      {pending ? "Deleting..." : "Delete"}
    </button>
  );
}

export default function DeleteProductForm({
  action,
  disabled = false,
  productId,
  productTitle,
}: DeleteProductFormProps) {
  return (
    <form
      action={action}
      onSubmit={(event) => {
        if (disabled) {
          event.preventDefault();
          return;
        }

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
      <DeleteButton disabled={disabled} />
    </form>
  );
}
