import React from 'react';

const Card = ({ 
  children, 
  className = '', 
  hover = true, 
  padding = 'p-6',
  ...props 
}) => {
  const hoverClasses = hover ? 'hover:shadow-luxury hover:-translate-y-1' : '';
  const classes = `card ${padding} ${hoverClasses} ${className}`.trim();
  
  return (
    <div className={classes} {...props}>
      {children}
    </div>
  );
};

export default Card;