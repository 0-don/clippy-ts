import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';

const General: React.FC = () => {
  return (
    <>
      <div className="border border-solid rounded-md border-zinc-700 shadow-2xl">
        <div className="flex items-center mb-2 space-x-2 bg-zinc-800 px-5 pt-5 pb-2.5">
          <FontAwesomeIcon icon={['far', 'hdd']} />
          <h2 className="font-semibold">Local Storage</h2>
        </div>

        <ul className="list-disc mx-5 px-5 pb-5">
          <li>asdsdasdasd</li>
        </ul>
      </div>
    </>
  );
};

export default General;
