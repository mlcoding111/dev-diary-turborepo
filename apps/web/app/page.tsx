import styles from './page.module.css';
import CreateProduct from './create-product/create-product';
import Products from './products/products';

export default function Home() {
  return (
    <div className={styles.page}>
      <CreateProduct />
      <Products />
    </div>
  );
}
