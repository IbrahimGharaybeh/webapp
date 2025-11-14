import { Link } from 'react-router-dom';

interface ButtonProps {
  text: string;
  onClick?: () => void;
  route?: string;
}

function Button({ text, onClick, route }: ButtonProps) {
  if (route) {
    return (
      <Link to={route}>
        <button onClick={onClick}>
          {text}
        </button>
      </Link>
    );
  }

  return (
    <button onClick={onClick}>
      {text}
    </button>
  );
}

export default Button;

