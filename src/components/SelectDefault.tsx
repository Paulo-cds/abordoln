interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  options: SelectOption[];
  disabled?: boolean;
  value?: string | number;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  placeholder?: string;
  required?: boolean;
  name: string;
  title?: string;
}

const SelectDefault: React.FC<SelectProps> = ({
  placeholder,
  onChange,
  disabled,
  value,
  required,
  name,
  title,
  options,
}) => {
  const isSelectOptionArray = (arr: SelectOption[]): arr is SelectOption[] => {
    // Verifica se o array não está vazio E se o primeiro elemento é um objeto E tem a propriedade 'label'
    return (
      arr.length > 0 &&
      typeof arr[0] === "object" &&
      arr[0] !== null &&
      "label" in arr[0]
    );
  };

  // Determine o tipo do array UMA VEZ antes do render
  const areOptionsObjects = isSelectOptionArray(options);
  return (
    <div>
      <label className="text-primary mb-2">
        {placeholder} {required ? "*" : ""}
      </label>
      <div className="relative">
        <select
          className="p-2 border border-gray-300 rounded w-full focus:outline-none focus:ring-2 focus:ring-primary text-primary"
          onChange={onChange}
          disabled={disabled}
          value={value}
          name={name}
          title={title}
        >
          {areOptionsObjects &&
            (options as SelectOption[]).map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
        </select>
      </div>
    </div>
  );
};

export default SelectDefault;
