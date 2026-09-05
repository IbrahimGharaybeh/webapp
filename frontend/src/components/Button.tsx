import { Link } from 'react-router-dom';

interface ButtonProps {
  text: string;
  onClick?: () => void;
  route?: string;
  style?: React.CSSProperties;
  className?: string;
}

function Button({ text, onClick, route, style, className }: ButtonProps) {
  const content = (
    <button onClick={onClick} style={style} className={className}>
      {text}
    </button>
  );

  if (route) {
    return <Link to={route}>{content}</Link>;
  }

  return content;
}

export default Button;
