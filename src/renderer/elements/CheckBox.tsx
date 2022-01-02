import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';

interface CheckBoxProps {
  text: string;
  checked: boolean;
  onChange: () => void;
}

const CheckBox: React.FC<CheckBoxProps> = ({ checked, onChange, text }) => {
  return (
    <button type="button" className="flex items-center" onClick={onChange}>
      <div className="bg-white dark:bg-dark border rounded-sm border-gray-400 dark:border-gray-700 w-5 h-5 flex flex-shrink-0 justify-center items-center relative">
        <input
          type="checkbox"
          className="checkbox opacity-0 absolute cursor-pointer w-full h-full"
          checked={checked}
          readOnly
        />
        <div className="check-icon hidden bg-indigo-600 text-white rounded-sm">
          <FontAwesomeIcon className="text-white text-sm m-0.5" icon="check" />
        </div>
      </div>
      <p className="ml-3 text-base leading-4 font-normal text-gray-800 dark:text-gray-100">
        {text}
      </p>
    </button>
  );
};

export default CheckBox;
