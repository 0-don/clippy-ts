import React, { useEffect } from 'react';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import useSettingsStore from '../../store/SettingsStore';
import SwitchField from '../../elements/SwitchField';

const ViewMore: React.FC = () => {
  const { settings, updateSettings } = useSettingsStore();

  useEffect(() => {
    const syncClipboardHistory = window.electron.on(
      'syncClipboardHistory',
      () =>
        updateSettings({
          ...settings,
          synchronize: !settings.synchronize,
        })
    );

    const preferences = window.electron.on('preferences', () =>
      window.electron.createSettingsWindow()
    );

    const about = window.electron.on('about', () =>
      window.electron.createAboutWindow()
    );

    const exit = window.electron.on('exit', () => window.electron.exit());

    return () => {
      syncClipboardHistory();
      preferences();
      about();
      exit();
    };
  }, [updateSettings, settings]);

  const createButton = (
    name: 'Sync Clipboard Hitory' | 'Preferences' | 'About' | 'Exit',
    icon: IconProp,
    onClick: () => void
  ) => (
    <button
      type="button"
      className="px-3 w-full hover:bg-neutral-700 cursor-pointer"
      onClick={onClick}
    >
      <div className="flex items-center justify-between py-4">
        <div className="flex items-center truncate">
          <FontAwesomeIcon icon={icon} className="text-2xl" />
          <p className="px-4 text-base font-semibold">{name}</p>
        </div>
        {name === 'Sync Clipboard Hitory' && (
          <SwitchField checked={settings.synchronize} onChange={undefined} />
        )}
      </div>
      <hr className="text-zinc-600" />
    </button>
  );

  return (
    <>
      {/* Sync Clipboard Hitory  */}
      {createButton('Sync Clipboard Hitory', ['far', 'save'], () =>
        updateSettings({ ...settings, synchronize: !settings.synchronize })
      )}

      {/* Preferences */}
      {createButton('Preferences', 'cog', () =>
        window.electron.createSettingsWindow()
      )}

      {/* About */}
      {createButton('About', 'info-circle', window.electron.createAboutWindow)}

      {/* Exit */}
      {createButton('Exit', 'sign-out-alt', window.electron.exit)}
    </>
  );
};

export default ViewMore;
