import styles from "./GeneralButton.module.scss";

type GeneralButtonProps = {
  label: string;
  onClick?: () => void;    
};
export function GeneralButton({label, onClick}: GeneralButtonProps) {

    return (
    <button className={styles.generalButton} onClick={onClick}>
      {label}
    </button>
  );
}