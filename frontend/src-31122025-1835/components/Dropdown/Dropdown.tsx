import './Dropdown.css';

interface DropdownProps {
  name?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options?: { code: string | number; en: string; ar?: string }[];
  language?: string;
  placeholder?: string;
}

function Dropdown({ name, value, onChange, options, language = 'en', placeholder = 'Select an option' }: DropdownProps) {
  return (
    <select name={name} value={value} onChange={onChange}>
      <option value="">{placeholder}</option>
      {options?.map((option) => (
        <option key={option.code} value={option.code}>
          {language === 'ar' && option.ar ? option.ar : option.en}
        </option>
      ))}
    </select>
  );
}

export default Dropdown;

