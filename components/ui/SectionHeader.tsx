import React from 'react';
import SectionBadge, { SectionBadgeVariant } from './SectionBadge';

interface SectionHeaderProps {
  badgeText?: string;
  badgeVariant?: SectionBadgeVariant;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  align?: 'left' | 'center';
  className?: string;
  titleClassName?: string;
  subtitleClassName?: string;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({
  badgeText,
  badgeVariant = 'muted',
  title,
  subtitle,
  align = 'left',
  className = '',
  titleClassName = 'text-4xl sm:text-5xl font-extrabold text-slate-900 dark:text-white',
  subtitleClassName = 'mt-4 text-lg text-slate-600 dark:text-slate-300',
}) => {
  const alignmentClass = align === 'center' ? 'text-center' : 'text-left';

  return (
    <div className={[alignmentClass, className].filter(Boolean).join(' ')}>
      {badgeText && (
        <div className="inline-block mb-4">
          <SectionBadge variant={badgeVariant}>{badgeText}</SectionBadge>
        </div>
      )}
      <h2 className={titleClassName}>{title}</h2>
      {subtitle && <p className={subtitleClassName}>{subtitle}</p>}
    </div>
  );
};

export default SectionHeader;
