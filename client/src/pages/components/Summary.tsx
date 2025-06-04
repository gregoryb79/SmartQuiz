import styles from './Summary.module.scss';
import { GeneralButton } from './GeneralButton';
type ConfirmProps = {
  question: string;
  onOk?: () => void;         
};
export function Confirm({question, onOk}: ConfirmProps) {

    return (
        <div className={styles.confirmContainer}> 
            <p>{question}</p>
            <div className={styles.confirmButtons}>
                <GeneralButton label="Ok" onClick={onOk} />                
            </div>
        </div>
    );

}