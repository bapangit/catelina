"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { useState } from "react";
import DeleteProductForm from "./DeleteProductForm";
import styles from "./page.module.css";

type AdminProductActionsProps = {
  deleteAction: (formData: FormData) => void | Promise<void>;
  productId: string;
  productTitle?: string;
};

const FULL_ADMIN_ACTION_PIN = "4026";
const EDIT_ONLY_PIN = "2345";

export default function AdminProductActions({
  deleteAction,
  productId,
  productTitle,
}: AdminProductActionsProps) {
  const { data: session } = useSession();
  const [pin, setPin] = useState("");
  const isAdmin = session?.user?.role === "admin";
  const canEdit = pin === FULL_ADMIN_ACTION_PIN || pin === EDIT_ONLY_PIN;
  const canDelete = pin === FULL_ADMIN_ACTION_PIN;

  if (!isAdmin) {
    return null;
  }

  return (
    <div className={styles.adminActions}>
      <div className={styles.adminActionGroup}>
        <label className={styles.adminPinField}>
          <span>PIN</span>
          <input
            aria-label="Admin action PIN"
            inputMode="numeric"
            maxLength={4}
            type="password"
            value={pin}
            onChange={(event) => setPin(event.target.value)}
          />
        </label>
        <Link
          aria-disabled={!canEdit}
          className={`${styles.editProductButton} ${
            !canEdit ? styles.disabledAdminButton : ""
          }`}
          href={canEdit ? `/admin/addproduct?id=${productId}` : "#"}
          onClick={(event) => {
            if (!canEdit) {
              event.preventDefault();
            }
          }}
          tabIndex={canEdit ? 0 : -1}
        >
          Edit
        </Link>
        <DeleteProductForm
          action={deleteAction}
          disabled={!canDelete}
          productId={productId}
          productTitle={productTitle}
        />
      </div>
    </div>
  );
}
