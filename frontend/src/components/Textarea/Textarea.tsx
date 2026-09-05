import './Textarea.css';

interface TextareaProps {
  name?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
}

function Textarea({ name, value, onChange, placeholder }: TextareaProps) {
  return (
    <textarea 
      name={name} 
      value={value} 
      onChange={onChange} 
      placeholder={placeholder}
    />
  );
}

export default Textarea;




