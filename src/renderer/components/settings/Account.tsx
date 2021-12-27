import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState, useEffect } from 'react';

const Account: React.FC = () => {
  const [url, setUrl] = useState<string>();

  useEffect(() => {
    const getUrl = async () => setUrl(await window.electron.getDatbasePath());
    getUrl();
  }, [setUrl]);

  return (
    <div
      role="button"
      tabIndex={-1}
      onKeyDown={() => {}}
      className="relative w-full group cursor-pointer"
      onClick={async () => setUrl(await window.electron.selectDatabasePath())}
    >
      <div className="italic text-sm border-gray-300 w-full px-3 py-0.5 dark:bg-dark-light dark:border-dark-light dark:text-white border rounded-md focus:outline-none dark:focus:bg-dark-dark">
        {url}
      </div>
      <div className="absolute inset-y-0 right-1 flex items-center">
        {/* <FontAwesomeIcon icon="search" /> */}
        <button
          type="button"
          className="text-xs bg-gray-600 text-white group-hover:bg-gray-400 px-2 rounded-xl group"
        >
          Browse
        </button>
      </div>
    </div>
  );
};

export default Account;
