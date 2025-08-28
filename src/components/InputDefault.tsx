import { useState } from "react";
import { FaEyeSlash } from "react-icons/fa";
import { FaEye } from "react-icons/fa";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  type?: string;
  disabled?: boolean;
  value?: string | number;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  required?: boolean;
  name: string;
  pattern?: string;
  title?: string;
}

interface TextareaProps extends React.InputHTMLAttributes<HTMLTextAreaElement> {
  type?: string;
  disabled?: boolean;
  value?: string | number;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
  required?: boolean;
  name: string;
  pattern?: string;
  title?: string;
}

const InputDefault: React.FC<InputProps> = ({
  placeholder,
  onChange,
  disabled,
  type,
  value,
  required,
  name,
  pattern,
  title,
}) => {
  const [inputType, setInputType] = useState(type);
  return (
    <div>
      <label className="text-primary mb-2">
        {placeholder} {required ? "*" : ""}
      </label>
      <div className="relative">
        <input
          className="p-2 border border-gray-300 rounded w-full focus:outline-none focus:ring-2 focus:ring-primary text-primary accent-primary"
          onChange={onChange}
          disabled={disabled}
          type={type ? (type === "password" ? inputType : type) : "text"}
          value={value}
          name={name}
          pattern={pattern}
          title={title}
        />
        {type === "password" && (
          <div
            className="absolute right-2 top-1/2 transform -translate-y-1/2  text-primary cursor-pointer"
            onClick={() =>
              setInputType(inputType === "password" ? "text" : "password")
            }
          >
            {inputType === "password" ? (
              <FaEyeSlash size={20} />
            ) : (
              <FaEye size={20} />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default InputDefault

export const TextareaDefault: React.FC<TextareaProps> = ({
  placeholder,
  onChange,
  disabled,
  // type,
  value,
  required,
  name,
  // pattern,
  title,
}) => {
  // const [inputType, setInputType] = useState(type);
  return (
    <div >
      <label className="text-primary mb-2">
        {placeholder} {required ? "*" : ""}
      </label>
      <div className="relative">
        <textarea
          className="p-2 border border-gray-300 rounded w-full focus:outline-none focus:ring-2 focus:ring-primary text-primary accent-primary"
          onChange={onChange}
          disabled={disabled}
          // type={type ? (type === "password" ? inputType : type) : "text"}
          value={value}
          name={name}
          rows={5}
          // cols={50}
          // pattern={pattern}
          title={title}
        />
        {/* {type === "password" && (
          <div
            className="absolute right-2 top-1/2 transform -translate-y-1/2  text-primary cursor-pointer"
            onClick={() =>
              setInputType(inputType === "password" ? "text" : "password")
            }
          >
            {inputType === "password" ? (
              <FaEyeSlash size={20} />
            ) : (
              <FaEye size={20} />
            )}
          </div>
        )} */}
      </div>
    </div>
  );
};
