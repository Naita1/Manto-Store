import './Input.css';

export function Input({ label, id, ...props }) {
  return (
    <div className="input-container">
      {label && <label htmlFor={id}>{label}</label>}
      
      <input id={id} className="manto-input" {...props} />
    </div>
  );
}