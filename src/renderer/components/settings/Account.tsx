import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState, useEffect } from 'react';

const Account: React.FC = () => {
  const [url, setUrl] = useState<string>();

  useEffect(() => {
    const getUrl = async () => setUrl(await window.electron.getDatbasePath());
    getUrl();
  }, [setUrl]);

  return (
    <>
      <h2 className="font-semibold mb-2">Database Location</h2>
      <div className="border border-solid rounded-md border-gray-400 p-5 flex w-full items-center space-x-3">
        <FontAwesomeIcon icon="globe-europe" />
        <div className="w-full">
          <button
            type="button"
            className="relative w-full group cursor-pointer"
            onClick={async () =>
              setUrl(await window.electron.selectDatabasePath())
            }
          >
            <div className="italic text-left text-sm border-gray-300 w-full px-3 py-0.5 dark:bg-dark-light dark:border-dark-light dark:text-white border rounded-md focus:outline-none dark:focus:bg-dark-dark">
              {url}
            </div>
            <div className="my-1 absolute space-x-1 inset-y-0 right-1 flex items-center text-xs bg-gray-600 text-white group-hover:bg-gray-400 px-2 rounded group">
              <FontAwesomeIcon icon="upload" />
              <div>Browse</div>
            </div>
          </button>
        </div>
      </div>
    </>
  );
};

export default Account;
