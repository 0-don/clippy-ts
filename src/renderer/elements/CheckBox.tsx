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
      <div className="bg-white dark:bg-gray-800 border rounded-sm border-gray-400 dark:border-gray-700 w-5 h-5 flex flex-shrink-0 justify-center items-center relative">
        <input
          type="checkbox"
          className="checkbox opacity-0 absolute cursor-pointer w-full h-full"
        />
        <div className="check-icon hidden bg-indigo-700 text-white rounded-sm">
          <svg
            className="icon icon-tabler icon-tabler-check"
            xmlns="http://www.w3.org/2000/svg"
            width={20}
            height={20}
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path stroke="none" d="M0 0h24v24H0z" />
            <path d="M5 12l5 5l10 -10" />
          </svg>
        </div>
      </div>
      <p className="ml-3 text-base leading-4 font-normal text-gray-800 dark:text-gray-100">
        {text}
      </p>
    </div>
  );
};

export default CheckBox;
