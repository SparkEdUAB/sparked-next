import styles from './BouncingLoader.module.css';

export default function BouncingLoader() {
  return (
    <div className={styles.container}>
      <div className={styles.first}></div>
      <div className={styles.second}></div>
      <div className={styles.third}></div>
      <div className={styles.fourth}></div>
    </div>
  );
}
