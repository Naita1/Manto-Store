import { twMerge } from 'tailwind-merge';
import { clsx } from 'clsx';

export function Button({ 
  children, 
  type = 'button', 
  className = '', 
  ...props 
}) {
  return (
    <button
      type={type}
      className={twMerge(
        clsx(
          `w-full py-3.5 px-6 
          bg-[#e50914] hover:bg-[#b80710] active:scale-[0.98]
          text-white font-semibold uppercase tracking-wider text-xs sm:text-sm
          rounded-full cursor-pointer select-none
          inline-flex items-center justify-center gap-2
          transition-[transform,background-color] duration-150 ease-out
          disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100 disabled:hover:bg-[#e50914]`,
          className
        )
      )}
      {...props}
    >
      {children}
    </button>
  );
}