import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import DarkMode from '../../elements/DarkMode';
import Shortcut from '../../elements/Shortcut';
import SwitchField from '../../elements/SwitchField';
import TextBlock from '../../elements/TextBlock';
import useSettingsStore from '../../store/SettingsStore';

const General: React.FC = () => {
  const { settings, updateSettings } = useSettingsStore();

  return (
    <>
      <TextBlock icon={['far', 'keyboard']} title="Keyboard shortcut">
        <div className="px-5 space-x-2 pb-5 flex items-center">
          <Shortcut event="windowDisplayToggle" />
        </div>
      </TextBlock>

      <TextBlock icon="cog" title="System">
        <div className="px-5 flex items-center space-x-2 pb-5 justify-between">
          <div className="flex items-center space-x-2 truncate">
            <FontAwesomeIcon icon="rocket" />
            <h6 className="text-sm">Start Clippy on system startup.</h6>
          </div>
          <div>
            <SwitchField
              checked={settings.startup}
              onChange={(check: boolean) =>
                updateSettings({ ...settings, startup: check })
              }
            />
          </div>
        </div>

        <div className="px-5 flex items-center space-x-2 pb-5 justify-between">
          <div className="flex items-center space-x-2 truncate">
            <FontAwesomeIcon icon="bell" />
            <h6 className="text-sm">Show desktop notifications.</h6>
          </div>
          <div>
            <SwitchField
              checked={settings.notification}
              onChange={(check: boolean) =>
                updateSettings({ ...settings, notification: check })
              }
            />
          </div>
        </div>

        <div className="px-5 flex items-center space-x-2 pb-5 justify-between">
          <div className="flex items-center space-x-2 truncate">
            <FontAwesomeIcon icon={['far', 'moon']} />
            <h6 className="text-sm">Switch Theme.</h6>
          </div>
          <div>
            <DarkMode />
          </div>
        </div>
      </TextBlock>
    </>
  );
};

export default General;
