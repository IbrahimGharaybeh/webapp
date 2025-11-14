import './Form.css';

interface FormProps {
  children: React.ReactNode;
  onSubmit?: (e: React.FormEvent<HTMLFormElement>) => void;
}

function Form({ children, onSubmit }: FormProps) {
  return (
    <form onSubmit={onSubmit}>
      {children}
    </form>
  );
}

export default Form;

