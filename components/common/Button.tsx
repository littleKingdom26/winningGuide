import { ButtonHTMLAttributes, forwardRef } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', fullWidth = false, className = '', children, ...props }, ref) => {
    const baseStyles = 'font-semibold rounded-button transition-all active:scale-95 disabled:opacity-50 disabled:active:scale-100';
    
    const variantStyles = {
      primary: 'bg-gradient-to-r from-suwon-red to-red-700 text-white shadow-lg shadow-red-500/30 hover:shadow-red-500/50',
      secondary: 'bg-suwon-cardDark text-suwon-textPrimary border-2 border-suwon-red/50 hover:border-suwon-red',
      outline: 'bg-transparent text-suwon-red border-2 border-suwon-red/50 hover:bg-suwon-red/10',
    };
    
    const sizeStyles = {
      sm: 'h-10 px-4 text-body2',
      md: 'h-12 px-6 text-body2',
      lg: 'h-14 px-8 text-body1',
    };
    
    return (
      <button
        ref={ref}
        className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${fullWidth ? 'w-full' : ''} ${className}`}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;