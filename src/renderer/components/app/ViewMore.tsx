import React, { useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import useSettingsStore from '../../store/SettingsStore';
import SwitchField from '../../elements/SwitchField';
import { ViewMoreName } from '../../utils/contants';
import { ExtendedHotKey } from '../../../main/utils/constants';

const ViewMore: React.FC = () => {
  const { settings, updateSettings, hotkeys, globalHotkeyEvent } =
    useSettingsStore();

  useEffect(() => {
    const syncClipboardHistory = window.electron.ipcRenderer.on(
      'syncClipboardHistory',
      async () => {
        await window.electron.ipcRenderer.toggleSyncClipboardHistory();
      }
    );

    const preferences = window.electron.ipcRenderer.on('preferences', () =>
      window.electron.ipcRenderer.createSettingsWindow()
    );

    const about = window.electron.ipcRenderer.on('about', () =>
      window.electron.ipcRenderer.createAboutWindow()
    );

    const exit = window.electron.ipcRenderer.on('exit', () =>
      window.electron.ipcRenderer.exit()
    );

    return () => {
      if (syncClipboardHistory) syncClipboardHistory();
      if (preferences) preferences();
      if (about) about();
      if (exit) exit();
    };
  }, [updateSettings, settings]);

  const createButton = (name: ViewMoreName, onClick: () => void) => {
    const hotkey = hotkeys.find((key) => key.name === name) as ExtendedHotKey;

    return (
      <button
        type="button"
        className="px-3 w-full hover:bg-neutral-700 cursor-pointer"
        onClick={onClick}
      >
        <div className="flex items-center justify-between py-4">
          <div className="flex items-center ">
            <div className="relative">
              <FontAwesomeIcon
                icon={JSON.parse(hotkey.icon)}
                className="text-2xl"
              />
              {globalHotkeyEvent && hotkey.status && (
                <div className="absolute top-0 left-0 bg-zinc-600 px-1 text-[12px] rounded-sm -mt-3 -ml-2 font-semibold">
                  {hotkey.key}
                </div>
              )}
            </div>
            <p className="px-4 text-base font-semibold">{name}</p>
          </div>
          {name === 'Sync Clipboard History' && (
            <SwitchField checked={settings.synchronize} onChange={undefined} />
          )}
        </div>
        <hr className="border-zinc-700" />
      </button>
    );
  };

  return (
    <>
      {/* Sync Clipboard History  */}
      {createButton('Sync Clipboard History', async () => {
        await window.electron.ipcRenderer.toggleSyncClipboardHistory();
      })}

      {/* Preferences */}
      {createButton('Preferences', () =>
        window.electron.ipcRenderer.createSettingsWindow()
      )}

      {/* About */}
      {createButton('About', () =>
        window.electron.ipcRenderer.createAboutWindow()
      )}

      {/* Exit */}
      {createButton('Exit', () => window.electron.ipcRenderer.exit())}
    </>
  );
};

export default ViewMore;
