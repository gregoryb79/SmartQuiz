import React from 'react';
import styles from "./NavButton.module.scss";

type NavButtonProps = {
  label: string;
  ariaLabel?: string;
  onClick?: () => void;    
};
export function NavButton({label, ariaLabel, onClick}: NavButtonProps) {

    return (
    <button className={styles.navButton} onClick={onClick} aria-label={ariaLabel}>
      {label}
    </button>
  );
}