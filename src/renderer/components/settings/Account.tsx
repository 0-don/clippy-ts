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
      <div className="border border-solid rounded-md border-zinc-700 shadow-2xl">
        <div className="flex items-center space-x-2 bg-zinc-800 px-5 pt-5 pb-2.5">
          <FontAwesomeIcon icon="globe-europe" />
          <h2 className="font-semibold">Database Location</h2>
        </div>

        <div className="list-disc px-5 pb-5 pt-2.5">
          <button
            type="button"
            className="relative w-full group cursor-pointer"
            onClick={async () =>
              setUrl(await window.electron.selectDatabasePath())
            }
          >
            <div
              title={url}
              className="italic text-left text-sm border-gray-300 w-full px-3 py-0.5 dark:bg-dark-light dark:border-dark-light dark:text-white border rounded-md focus:outline-none dark:focus:bg-dark-dark"
            >
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
