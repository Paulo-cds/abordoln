interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  type?: "submit" | "reset" | "button";
  action?: () => void;
  text: string;
  disabled?: boolean;
  colorSecondary?:boolean;
}

const ButtonDefault: React.FC<ButtonProps> = ({ text, action, disabled,type, colorSecondary }) => {
  return (
    <button
      className={`hover:opacity-80 ${disabled ? 'opacity-80' : ""} cursor-pointer ${colorSecondary ? 'text-secondary' : 'text-primary'}  font-bold py-3 px-4 rounded-2xl w-full max-w-[400px] max-h-[40px] flex items-center justify-center`}
      onClick={action}
      disabled={disabled}
      type={type || "button"}
      style={{backgroundColor: disabled ? 'grey' : colorSecondary ? "#003366" : "#FFD700"}}
    >
      {text}
    </button>
  );
};

export default ButtonDefault;
