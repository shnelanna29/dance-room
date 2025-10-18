import React from 'react';
import './Button.css';

const Button = ({ 
  children, 
  variant = 'primary', 
  type = 'button', 
  onClick, 
  disabled = false,
  fullWidth = false,
  className = '',
  ...rest 
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`btn btn-${variant} ${fullWidth ? 'btn-fullwidth' : ''} ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
};

export default Button;
