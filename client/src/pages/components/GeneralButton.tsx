import styles from "./GeneralButton.module.scss";

type NavButtonProps = {
  label: string;
  onClick?: () => void;    
};
export function GeneralButton({label, onClick}: NavButtonProps) {

    return (
    <button className={styles.generalButton} onClick={onClick}>
      {label}
    </button>
  );
}