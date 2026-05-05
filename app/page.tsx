import Image from "next/image";
import styles from "./Page.module.css";

const heroImage =
  "https://img.magnific.com/premium-photo/portrait-gorgeous-woman-wearing-beautiful-maxi-dress-posing-against-wall-with-wild-grape_144962-18080.jpg?w=1060";

export default function Home() {
  return (
    <section className={styles.hero_section}>
      <div className={styles.hero_content}>
        <div className={styles.hero_copy}>
          <p className={styles.hero_eyebrow}>New season edit</p>
          <h1 className={styles.hero_title}>Elegant maxi dresses for standout moments</h1>
          <p className={styles.hero_text}>
            Discover flowing silhouettes, soft textures, and refined details made
            for day-to-evening dressing.
          </p>
          <a className={styles.hero_cta} href="/products">
            Shop collection
          </a>
        </div>
        <div className={styles.hero_image_wrap}>
          <Image
            className={styles.hero_image}
            src={heroImage}
            alt="Woman wearing a beautiful maxi dress"
            fill
            priority
            sizes="(max-width: 768px) 100vw, 48vw"
          />
        </div>
      </div>
    </section>
  );
}
