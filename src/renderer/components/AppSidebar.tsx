import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import DarkMode from '../elements/DarkMode';
import useAppStore from '../store/AppStore';

const AppSidebar: React.FC = () => {
  const { tab, setTab } = useAppStore();
  return (
    <>
      <DarkMode />
      <FontAwesomeIcon
        size="lg"
        className={`${
          tab === 'Recent Clipboards'
            ? 'text-black dark:text-white'
            : 'text-gray-500 dark:text-gray-dark'
        } dark:hover:text-white  hover:text-black cursor-pointer`}
        icon={['fas', 'history']}
        onClick={() => setTab('Recent Clipboards')}
        title="Recent Clipboards"
      />
      <FontAwesomeIcon
        size="lg"
        className={`${
          tab === 'Starred Clipboards'
            ? 'text-black dark:text-white'
            : 'text-gray-500 dark:text-gray-dark'
        } dark:hover:text-white  hover:text-black cursor-pointer`}
        icon={['fas', 'star']}
        onClick={() => setTab('Starred Clipboards')}
        title="Starred Clipboards"
      />
      <FontAwesomeIcon
        size="lg"
        className={`${
          tab === 'History'
            ? 'text-black dark:text-white'
            : 'text-gray-500 dark:text-gray-dark'
        } dark:hover:text-white  hover:text-black cursor-pointer`}
        icon={['fas', 'search']}
        onClick={() => setTab('History')}
        title="History"
      />
      <FontAwesomeIcon
        size="lg"
        className={`${
          tab === 'View more'
            ? 'text-black dark:text-white'
            : 'text-gray-500 dark:text-gray-dark'
        } dark:hover:text-white  hover:text-black cursor-pointer`}
        icon={['fas', 'ellipsis-h']}
        onClick={() => setTab('View more')}
        title="View more"
      />
    </>
  );
};

export default AppSidebar;
