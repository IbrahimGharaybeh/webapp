import './Input.css';

interface InputProps {
  name?: string;
  type?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
}

function Input({ name, type = 'text', value, onChange, placeholder }: InputProps) {
  return (
    <input 
      type={type} 
      name={name} 
      value={value} 
      onChange={onChange} 
      placeholder={placeholder}
    />
  );
}

export default Input;




