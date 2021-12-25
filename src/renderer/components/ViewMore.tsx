import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import useSettingsStore from '../store/SettingsStore';
import SwitchField from '../elements/SwitchField';

const ViewMore: React.FC = () => {
  const { sync, setSync } = useSettingsStore();

  return (
    <>
      {/* Sync Clipboard Hitory  */}
      <div
        role="button"
        tabIndex={-1}
        onKeyDown={() => {}}
        className="px-3 w-full hover:bg-neutral-700 cursor-pointer"
        onClick={setSync}
      >
        <div className="flex items-center justify-between py-4">
          <div className="flex items-center truncate">
            <FontAwesomeIcon icon={['far', 'save']} className="text-2xl" />
            <p className="px-4 text-base font-semibold">
              Sync Clipboard Hitory
            </p>
          </div>
          <SwitchField checked={sync === 'online'} onChange={undefined} />
        </div>
        <hr className="text-zinc-600" />
      </div>

      {/* Preferences */}
      <div
        role="button"
        tabIndex={-2}
        onKeyDown={() => {}}
        className="px-3 w-full hover:bg-neutral-700 cursor-pointer"
        onClick={() => window.electron.createSettingsWindow()}
      >
        <div className="flex items-center py-4">
          <FontAwesomeIcon icon="cog" className="text-2xl" />
          <p className="px-4 text-base font-semibold">Preferences</p>
        </div>
        <hr className="text-zinc-600" />
      </div>

      {/* About */}
      <div
        role="button"
        tabIndex={-3}
        onKeyDown={() => {}}
        className="px-3 w-full hover:bg-neutral-700 cursor-pointer"
        onClick={() => window.electron.createAboutWindow()}
      >
        <div className="flex items-center py-4">
          <FontAwesomeIcon icon="info-circle" className="text-2xl" />
          <p className="px-4 text-base font-semibold">About</p>
        </div>
        <hr className="text-zinc-600" />
      </div>

      {/* Exit */}
      <div
        role="button"
        tabIndex={-4}
        onKeyDown={() => {}}
        className="px-3 w-full hover:bg-neutral-700 cursor-pointer"
        onClick={() => window.electron.exit()}
      >
        <div className="flex items-center py-4">
          <FontAwesomeIcon icon="sign-out-alt" className="text-2xl" />
          <p className="px-4 text-base font-semibold">Exit</p>
        </div>
        <hr className="text-zinc-600" />
      </div>
    </>
  );
};

export default ViewMore;
