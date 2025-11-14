import React, { HTMLAttributes } from 'react';

interface BrowserMockupProps extends HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  headerContent?: React.ReactNode;
}

const BrowserMockup: React.FC<BrowserMockupProps> = ({
  children,
  className = '',
  headerContent,
  ...rest
}) => {
  return (
    <div className={['browser-mockup', className].filter(Boolean).join(' ')} {...rest}>
      <div className="browser-header">
        <div className="browser-dot browser-dot-red"></div>
        <div className="browser-dot browser-dot-yellow"></div>
        <div className="browser-dot browser-dot-green"></div>
        {headerContent}
      </div>
      {children}
    </div>
  );
};

export default BrowserMockup;
