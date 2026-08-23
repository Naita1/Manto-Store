import './Button.css';

export function Button({ children, className = '', ...props }) {
  return (
    <button
      className={`w-full py-3.5 px-6 bg-primary hover:bg-[#961c1c] text-white font-semibold uppercase tracking-widest rounded-full transition-all duration-200 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shadow-lg shadow-[#B22222]/20 ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
