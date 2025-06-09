import React from 'react';
import styles from "./NavButton.module.scss";

type NavButtonProps = {
  title?: string;
  label?: string;
  icon?: React.ReactNode;
  ariaLabel?: string;
  onClick?: () => void;    
};
export function NavButton({title, label, ariaLabel, icon, onClick}: NavButtonProps) {

    return (
    <button className={styles.navButton} onClick={onClick} aria-label={ariaLabel} title={title}>
      {icon}
      {label}
    </button>
  );
}