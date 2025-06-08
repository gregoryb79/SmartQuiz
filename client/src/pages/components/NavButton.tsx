import React from 'react';
import styles from "./NavButton.module.scss";

type NavButtonProps = {
  label?: string;
  icon?: React.ReactNode;
  ariaLabel?: string;
  onClick?: () => void;    
};
export function NavButton({label, ariaLabel, icon, onClick}: NavButtonProps) {

    return (
    <button className={styles.navButton} onClick={onClick} aria-label={ariaLabel}>
      {icon}
      {label}
    </button>
  );
}