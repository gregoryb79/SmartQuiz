import styles from "./QuizButton.module.scss";

type QuizButtonProps = {
  label: string;
  name: string;
  value: string;
  checked: boolean;
  onChange: (value: string) => void;
};

export function QuizButton({ label, name, value, checked, onChange }: QuizButtonProps) {
  return (
    <label className={`${styles.quizButton} ${checked ? styles.selected : ""}`}>
      <input 
        type="radio"
        name={name}
        value={value}
        checked={checked}
        onChange={() => onChange(value)}        
      />
      {label}
    </label>
  );
}