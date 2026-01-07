import { Link } from 'react-router-dom';

interface ButtonProps {
  text: string;
  onClick?: () => void;
  route?: string;
  style?: React.CSSProperties;
}

function Button({ text, onClick, route, style }: ButtonProps) {
  const content = (
    <button onClick={onClick} style={style}>
      {text}
    </button>
  );

  if (route) {
    return <Link to={route}>{content}</Link>;
  }

  return content;
}

export default Button;
