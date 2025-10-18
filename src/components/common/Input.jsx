import React from 'react';
import './Input.css';

const Input = React.forwardRef(({ 
  label, 
  error, 
  type = 'text', 
  placeholder = '', 
  ...rest 
}, ref) => {
  return (
    <div className="input-wrapper">
      {label && <label className="input-label">{label}</label>}
      <input
        ref={ref}
        type={type}
        placeholder={placeholder}
        className={`input-field ${error ? 'input-error' : ''}`}
        {...rest}
      />
      {error && <span className="error-message">{error}</span>}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
