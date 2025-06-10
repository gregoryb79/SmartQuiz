import { AppIcon } from "./components/AppIcon";
import styles from "./NotFound.module.scss";

export function NotFound() {
  return (
    <div className={styles.notfoundContainer}>
      <h1>404 - Not Found</h1>
      <p>The page you are looking for does not exist.</p>
      <AppIcon />
    </div>
  );
}