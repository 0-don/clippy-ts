import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import useAppStore from '../../store/AppStore';

const AppSidebar: React.FC = () => {
  const sidebarIcons = useAppStore((state) => state.sidebarIcons);
  const setSidebarIcon = useAppStore((state) => state.setSidebarIcon);

  return (
    <>
      {sidebarIcons.map((sIcon) => (
        <FontAwesomeIcon
          key={sIcon.name}
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
      ))}
    </>
  );
};

export default AppSidebar;
