import React from 'react';
import styles from "./NavButton.module.scss";

type NavButtonProps = {
  label: string;
  onClick?: () => void;    
};
export function NavButton({label, onClick}: NavButtonProps) {

    return (
    <button className={styles.navButton} onClick={onClick}>
      {label}
    </button>
  );
}