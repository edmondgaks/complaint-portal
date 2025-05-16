import React from 'react';

interface BadgeProps {
  text: string;
  color: string;
  className?: string;
}

const Badge: React.FC<BadgeProps> = ({ text, color, className = '' }) => {
  return (
    <span 
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${color} ${className}`}
    >
      {text}
    </span>
  );
};

export default Badge;