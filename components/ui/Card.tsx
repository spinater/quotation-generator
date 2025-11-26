import React from 'react';

export interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  title?: string;
  subtitle?: string;
  headerAction?: React.ReactNode;
}

export function Card({
  children,
  className = '',
  padding = 'md',
  title,
  subtitle,
  headerAction,
}: CardProps) {
  const paddingStyles = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  const cardClasses = `
    bg-white rounded-lg border border-gray-200 shadow-sm
    ${className}
  `.trim().replace(/\s+/g, ' ');

  const bodyClasses = paddingStyles[padding];

  return (
    <div className={cardClasses}>
      {(title || subtitle || headerAction) && (
        <div className={`border-b border-gray-200 ${padding !== 'none' ? 'px-6 py-4' : ''}`}>
          <div className="flex items-start justify-between">
            <div>
              {title && (
                <h3 className="text-lg font-semibold text-gray-900">
                  {title}
                </h3>
              )}
              {subtitle && (
                <p className="mt-1 text-sm text-gray-500">
                  {subtitle}
                </p>
              )}
            </div>
            {headerAction && (
              <div className="ml-4 flex-shrink-0">
                {headerAction}
              </div>
            )}
          </div>
        </div>
      )}
      <div className={bodyClasses}>
        {children}
      </div>
    </div>
  );
}

export interface CardSectionProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
}

export function CardSection({ children, className = '', title }: CardSectionProps) {
  return (
    <div className={`space-y-4 ${className}`.trim()}>
      {title && (
        <h4 className="text-md font-medium text-gray-900">
          {title}
        </h4>
      )}
      {children}
    </div>
  );
}
