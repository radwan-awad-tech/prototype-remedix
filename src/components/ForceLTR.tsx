import React from 'react';

interface ForceLTRProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * A helper component to ensure specific text (like IDs, emails, or phone numbers)
 * remains LTR even when the parent container is in RTL mode.
 */
export const ForceLTR: React.FC<ForceLTRProps> = ({ children, className = '' }) => {
  return (
    <span dir="ltr" className={`inline-block ${className}`}>
      {children}
    </span>
  );
};
