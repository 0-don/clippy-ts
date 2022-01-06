import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import useSettingsStore from '../../store/SettingsStore';
import useAppStore from '../../store/AppStore';

const AppSidebar: React.FC = () => {
  const { hotkeys, globalHotkeyEvent } = useSettingsStore();
  const { sidebarIcons, setSidebarIcon } = useAppStore();

  return (
    <>
      {sidebarIcons.map((sIcon) => {
        const currentHotkey = hotkeys.find((key) => key.name === sIcon.name);
        return (
          <div className="relative" key={sIcon.name}>
            <FontAwesomeIcon
              size="lg"
              className={`${
                sIcon.current
                  ? 'text-black dark:text-white'
                  : 'text-gray-500 dark:text-gray-dark'
              } dark:hover:text-white  hover:text-black cursor-pointer`}
              icon={sIcon.icon}
              onClick={() => setSidebarIcon(sIcon.name)}
              title={sIcon.name}
            />
            {currentHotkey?.status && globalHotkeyEvent && (
              <div className="absolute top-0 left-0 bg-zinc-600 p-0.5 text-[12px] rounded-sm -mt-3 -ml-3 font-semibold">
                {currentHotkey.key}
              </div>
            )}
          </div>
        );
      })}
    </>
  );
};

export default AppSidebar;
