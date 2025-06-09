import styles from "./Profile.module.scss";

export function Profile() {
  return (
    <div className={styles.profileContainer}>
      <h2>Profile Page</h2>
      <p>This is the profile page where user information will be displayed.</p>
      {/* Additional profile content can be added here */}
    </div>
  );
}