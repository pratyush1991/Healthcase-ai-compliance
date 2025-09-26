import React from 'react';

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  onAccent?: boolean;
  className?: string;
}

const Spinner: React.FC<SpinnerProps> = ({ size = 'md', onAccent = false, className = '' }) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8',
  };

  const colorClasses = onAccent
    ? 'border-white' // For use on dark, accent-colored backgrounds like buttons
    : 'border-indigo-600 dark:border-indigo-400'; // For use on page backgrounds

  return (
    <div
      className={`animate-spin rounded-full border-2 border-t-transparent ${colorClasses} ${sizeClasses[size]} ${className}`}
      role="status"
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
};

export default Spinner;