import favicon from "../../assets/favicon.png";
import styles from './AppIcon.module.scss';

export function AppIcon() {
    return (
        <> 
            <img className={styles.appIcon} src={favicon} alt="application icon" /> 
        </>       
    );
}