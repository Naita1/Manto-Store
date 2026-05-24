import './Input.css';

export function Input({ label, id, error, className = '', ...props }) {
  return (
    <div className="input-container">
      {label && <label htmlFor={id}>{label}</label>}

      <input
        id={id}
        className={`manto-input ${error ? 'manto-input--error' : ''} ${className}`}
        aria-invalid={error ? 'true' : undefined}
        aria-describedby={error ? `${id}-error` : undefined}
        {...props}
      />

      {error && (
        <span id={`${id}-error`} className="input-error-message" role="alert">
          {error}
        </span>
      )}
    </div>
  );
}