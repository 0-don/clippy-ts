import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import useSettingsStore from '../../store/SettingsStore';
import SwitchField from '../../elements/SwitchField';

const ViewMore: React.FC = () => {
  const { settings, updateSettings } = useSettingsStore();

  return (
    <>
      {/* Sync Clipboard Hitory  */}
      <button
        type="button"
        className="px-3 hover:bg-neutral-700 cursor-pointer w-full"
        onClick={() =>
          updateSettings({ ...settings, synchronize: !settings.synchronize })
        }
      >
        <div className="flex items-center justify-between py-4">
          <div className="flex items-center truncate">
            <FontAwesomeIcon icon={['far', 'save']} className="text-2xl" />
            <p className="px-4 text-base font-semibold">
              Sync Clipboard Hitory
            </p>
          </div>
          <SwitchField checked={settings.synchronize} onChange={undefined} />
        </div>
        <hr className="text-zinc-600" />
      </button>

      {/* Preferences */}
      <button
        type="button"
        className="px-3 w-full hover:bg-neutral-700 cursor-pointer"
        onClick={() => window.electron.createSettingsWindow()}
      >
        <div className="flex items-center py-4">
          <FontAwesomeIcon icon="cog" className="text-2xl" />
          <p className="px-4 text-base font-semibold">Preferences</p>
        </div>
        <hr className="text-zinc-600" />
      </button>

      {/* About */}
      <button
        type="button"
        className="px-3 w-full hover:bg-neutral-700 cursor-pointer"
        onClick={() => window.electron.createAboutWindow()}
      >
        <div className="flex items-center py-4">
          <FontAwesomeIcon icon="info-circle" className="text-2xl" />
          <p className="px-4 text-base font-semibold">About</p>
        </div>
        <hr className="text-zinc-600" />
      </button>

      {/* Exit */}
      <button
        type="button"
        className="px-3 w-full hover:bg-neutral-700 cursor-pointer"
        onClick={() => window.electron.exit()}
      >
        <div className="flex items-center py-4">
          <FontAwesomeIcon icon="sign-out-alt" className="text-2xl" />
          <p className="px-4 text-base font-semibold">Exit</p>
        </div>
        <hr className="text-zinc-600" />
      </button>
    </>
  );
};

export default ViewMore;
