import Link from "next/link";
import { dressCategories } from "@/config/productInfoOpt";
import styles from "./page.module.css";

export default function CategoriesPage() {
  return (
    <section className={styles.page}>
      <div className={styles.hero}>
        <p className={styles.eyebrow}>Shop by Category</p>
        <h1 className={styles.title}>Indian Ladies Clothing</h1>
        <p className={styles.subtitle}>
          Explore a few curated categories to start browsing women&apos;s ethnic styles.
        </p>
      </div>

      <div className={styles.grid}>
        {dressCategories.map((category) => (
          <article key={category.name} className={styles.card}>
            <div
              className={styles.image}
              style={{ backgroundImage: `url(${category.image})` }}
              aria-hidden="true"
            />
            <div className={styles.content}>
              <h2 className={styles.cardTitle}>{category.name}</h2>
              <p className={styles.cardText}>{category.description}</p>
              <Link href="/products" className={styles.link}>
                View Products
              </Link>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
