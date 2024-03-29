import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState, useEffect } from 'react';
import TextBlock from '../../elements/TextBlock';
import SwitchField from '../../elements/SwitchField';
import useSettingsStore from '../../store/SettingsStore';
import Dropdown from '../../elements/Dropdown';

const Account: React.FC = () => {
  const [url, setUrl] = useState<string>();
  const { settings, updateSettings } = useSettingsStore();

  useEffect(() => {
    const getUrl = async () => {
      const res = await window.electron.ipcRenderer.getDatbasePath();
      if (res) setUrl(res);
    };
    getUrl();
  }, [setUrl, settings]);

  return (
    <>
      <TextBlock icon="sync" title="Sync">
        <div className="px-5 flex items-center mb-2 space-x-2 pb-2.5 justify-between">
          <div className="flex items-center space-x-2 truncate">
            <FontAwesomeIcon icon={['far', 'save']} />
            <h6 className="text-sm">Synchronize clipboard history</h6>
          </div>
          <div>
            <SwitchField
              checked={settings?.synchronize}
              onChange={async () => {
                await window.electron.ipcRenderer.toggleSyncClipboardHistory();
              }}
            />
          </div>
        </div>
        {settings?.synchronize && (
          <div className="px-5 flex items-center mb-2 space-x-2 pb-2.5 justify-between">
            <div className="flex items-center space-x-2 truncate">
              <FontAwesomeIcon icon={['far', 'clock']} />
              <h6 className="text-sm">Change backup time</h6>
            </div>
            <div className="flex items-center">
              <p className="text-sm">Minutes:&nbsp;</p>
              <Dropdown
                items={[1, 5, 10, 15, 30, 60]}
                value={settings.syncTime / 60}
                onChange={async (syncTime) => {
                  await updateSettings({
                    ...settings,
                    syncTime: (syncTime as number) * 60,
                  });
                }}
              />
            </div>
          </div>
        )}
      </TextBlock>

      {url && settings?.synchronize && (
        <TextBlock
          icon="globe-europe"
          title="Database Location"
          className="animate-fade"
        >
          <div className="list-disc px-5 pb-5 pt-2.5">
            <button
              type="button"
              className="relative w-full group cursor-pointer"
              onClick={async () => {
                const res = await window.electron.ipcRenderer.getDatbasePath();
                if (res) setUrl(res as string);
              }}
            >
              <div
                title={url}
                className="truncate italic text-left text-sm border-gray-300 w-full px-3 py-0.5 dark:bg-dark-light dark:border-dark-light dark:text-white border rounded-md focus:outline-none dark:focus:bg-dark-dark"
              >
                {url}
              </div>
              <div className="my-1 absolute space-x-1 inset-y-0 right-1 flex items-center text-xs bg-gray-600 text-white group-hover:bg-gray-400 px-2 rounded group">
                <FontAwesomeIcon icon="upload" />
                <div>Browse</div>
              </div>
            </button>
          </div>
        </TextBlock>
      )}
    </>
  );
};

export default Account;
