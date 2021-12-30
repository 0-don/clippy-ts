import React, { Dispatch, SetStateAction } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

interface CheckBoxProps {
  text: string;
  checked: boolean;
  onChange: undefined | (() => void) | Dispatch<SetStateAction<boolean>>;
}

const CheckBox: React.FC<CheckBoxProps> = ({ checked, onChange, text }) => {
  console.log(checked, onChange);

  return (
    <div className="flex items-center">
      <div className="bg-white dark:bg-dark border rounded-sm border-gray-400 dark:border-gray-700 w-5 h-5 flex flex-shrink-0 justify-center items-center relative">
        <input
          type="checkbox"
          className="checkbox opacity-0 absolute cursor-pointer w-full h-full"
        />
        <div className="check-icon hidden bg-indigo-600 text-white rounded-sm">
          <FontAwesomeIcon className="text-white text-sm m-0.5" icon="check" />
        </div>
      </div>
      <p className="ml-3 text-base leading-4 font-normal text-gray-800 dark:text-gray-100">
        {text}
      </p>
    </div>
  );
};

export default CheckBox;
