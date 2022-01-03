import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useState } from 'react';
import useSettingsStore from '../../store/SettingsStore';
import { Prisma } from '../../../main/prisma/client';
import Shortcut from '../../elements/Shortcut';
import SwitchField from '../../elements/SwitchField';
import TextBlock from '../../elements/TextBlock';

const General: React.FC = () => {
  const [stg, setSettings] = useState<Prisma.SettingsCreateInput>();

  const { settings } = useSettingsStore();

  useEffect(() => {
    const getSettings = async () =>
      setSettings(await window.electron.getSettings());
    getSettings();
  }, [setSettings]);

  if (!stg) {
    return null;
  }

  return (
    <>
      <TextBlock icon="cog" title="System">
        <div className="px-5 flex items-center space-x-2 pb-5 justify-between">
          <div className="flex items-center space-x-2 truncate">
            <FontAwesomeIcon icon="rocket" />
            <h6 className="text-sm">Start Clippy on system startup.</h6>
          </div>
          <div>
            <SwitchField
              checked={settings?.startup ?? false}
              onChange={(check: boolean) =>
                setSettings({ ...stg, startup: check })
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
              checked={stg.notification}
              onChange={(check: boolean) =>
                setSettings({ ...stg, notification: check })
              }
            />
          </div>
        </div>
      </TextBlock>

      <TextBlock icon={['far', 'keyboard']} title="Keyboard shorcut">
        <div className="px-5 space-x-5 pb-5 flex items-center">
          <Shortcut event="windowDisplayToggle" />
        </div>
      </TextBlock>
    </>
  );
};

export default General;
