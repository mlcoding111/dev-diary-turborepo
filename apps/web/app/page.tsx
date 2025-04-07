import styles from './page.module.css';
import HomePage from '../pages/Home';

export const dynamic = "force-dynamic";

export default function Home() {
  return (
    <div className={styles.page}>
      <HomePage />
      {/* <CreateProduct />
      <Products /> */}
    </div>
  );
}
