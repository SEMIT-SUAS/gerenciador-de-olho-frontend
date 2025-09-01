import React from 'react';

interface PageHeaderProps {
  title: string;
  description: string;
}

const PageHeader: React.FC<PageHeaderProps> = ({ title, description }) => {
  return (
    <div className="max-w-[640px]">
      <h2 className="text-3xl font-bold tracking-tight">{title}</h2>
      <p className="text-slate-600 text-xs sm:text-sm mt-1">{description}</p>
    </div>
  );
};

export default PageHeader;
