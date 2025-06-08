import styles from './ErrorMsg.module.scss';
import { GeneralButton } from './GeneralButton';
type ConfirmProps = {
  message: string;
  onOk?: () => void;     
};
export function ErrorMsg({message, onOk}: ConfirmProps) {

    return (
        <div className={styles.errorContainer}> 
            <p>{message}</p>
            <GeneralButton label="Ok" onClick={onOk} />              
        </div>
    );

}