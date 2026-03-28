import './Button.css';

export function Button({ children, ...props }) {
  return (
    <button className="manto-button" {...props}>
      {children}
    </button>
  );
}