import styles from './page.module.css'

export default function ProductPage({ params }: { params: { id: string } }) {
  // TODO: Fetch product data based on params.id
  // For now, using sample data
  const product = {
    title: 'Sample Product',
    price: 29.99,
    image: 'https://res.cloudinary.com/dqtxgyuoj/image/upload/v1777437521/652768389_18094564007047443_8280489683697880738_n_pjpujd.webp' // Assuming an image in public/icons
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>{product.title}</h1>
      <img className={styles.image} src={product.image} alt={product.title} />
      <p className={styles.price}>${product.price}</p>
    </div>
  )
}