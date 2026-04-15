import React from 'react';

interface FilterSectionProps {
  title: string;
  children: React.ReactNode;
  action?: React.ReactNode;
}

/**
 * Reusable wrapper for marketplace filter sections
 */
export const FilterSection: React.FC<FilterSectionProps> = ({ title, children, action }) => {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="text-body-sm font-semibold text-neutral-800">{title}</h4>
        {action}
      </div>
      <div className="space-y-2">
        {children}
      </div>
    </div>
  );
};
