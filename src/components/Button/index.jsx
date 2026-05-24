import './Button.css';

export function Button({ children, className = '', ...props }) {
  return (
    <button className={`manto-button ${className}`} {...props}>
      {children}
    </button>
  );
}