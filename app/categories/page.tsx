import Link from "next/link";
import styles from "./page.module.css";

const categories = [
  {
    name: "Sarees",
    description: "Classic drapes for festive, wedding, and everyday elegance.",
    image:
      "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=900&q=80",
  },
  {
    name: "Kurtis",
    description: "Easy ethnic wear styles for office, outings, and daily comfort.",
    image:
      "https://images.unsplash.com/photo-1583391733981-849ab0f1e0c3?auto=format&fit=crop&w=900&q=80",
  },
  {
    name: "Lehengas",
    description: "Statement occasion outfits for celebrations and special events.",
    image:
      "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=900&q=80",
  },
];

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
        {categories.map((category) => (
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
