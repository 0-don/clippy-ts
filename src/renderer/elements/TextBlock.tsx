import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconProp } from '@fortawesome/fontawesome-svg-core';

type TexBlockProps = {
  icon: IconProp;
  title: string;
  className?: string;
};

const defaultProps = {
  className: undefined,
};

const TexBlock: React.FC<TexBlockProps> = ({
  children,
  icon,
  title,
  className,
}) => {
  return (
    <div
      className={`border border-solid rounded-md border-zinc-700 shadow-2xl mb-7 ${className}`}
    >
      <div className="flex items-center mb-2 space-x-2 bg-zinc-800 px-5 pt-5 pb-2.5">
        <FontAwesomeIcon icon={icon} />
        <h2 className="font-semibold">{title}</h2>
      </div>
      {children}
    </div>
  );
};

TexBlock.defaultProps = defaultProps;

export default TexBlock;
