import { useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import StarredClipboards from '../components/app/StarredClipboards';
import AppSidebar from '../components/app/AppSidebar';
import useAppStore from '../store/AppStore';
import RecentClipboards from '../components/app/RecentClipboards';
import History from '../components/app/History';
import ViewMore from '../components/app/ViewMore';
import useSettingsStore from '../store/SettingsStore';
import { SidebarIconName } from '../utils/contants';

const App = () => {
  const { settings, setGlobalHotkeyEvent, globalHotkeyEvent } =
    useSettingsStore();
  const { sidebarIcons, setSidebarIcon } = useAppStore();

  const sIcon = sidebarIcons.find((icon) => icon.current);

  useEffect(() => {
    const setRecentClipboards = window.electron.ipcRenderer.on(
      'recentClipboards',
      (sidebarIconName) => setSidebarIcon(sidebarIconName as SidebarIconName)
    );

    const setStarredClipboards = window.electron.ipcRenderer.on(
      'starredClipboards',
      (sidebarIconName) => setSidebarIcon(sidebarIconName as SidebarIconName)
    );

    const setHistory = window.electron.ipcRenderer.on(
      'history',
      (sidebarIconName) => setSidebarIcon(sidebarIconName as SidebarIconName)
    );

    const setViewMore = window.electron.ipcRenderer.on(
      'viewMore',
      (sidebarIconName) => setSidebarIcon(sidebarIconName as SidebarIconName)
    );

    const enableHotkey = window.electron.ipcRenderer.on(
      'enableHotkey',
      (status) => {
        setSidebarIcon('Recent Clipboards');
        setGlobalHotkeyEvent(status as boolean);
      }
    );

    return () => {
      if (setRecentClipboards) setRecentClipboards();
      if (setStarredClipboards) setStarredClipboards();
      if (setHistory) setHistory();
      if (setViewMore) setViewMore();
      if (enableHotkey) enableHotkey();
    };
  }, [setSidebarIcon, setGlobalHotkeyEvent]);

  useEffect(() => {
    const delayDebounceFn =
      globalHotkeyEvent &&
      setTimeout(async () => {
        setGlobalHotkeyEvent(false);
        await window.electron.ipcRenderer.disableHotkeys();
      }, 5000);

    return () => {
      if (delayDebounceFn) clearTimeout(delayDebounceFn);
    };
  }, [setGlobalHotkeyEvent, globalHotkeyEvent]);

  return (
    <div className="absolute w-full h-full dark:bg-dark bg-white dark:text-white text-black flex overflow-hidden ">
      <div className="dark:bg-dark-light bg-gray-200 flex flex-col items-center space-y-7 pt-5 px-3.5">
        <AppSidebar />
      </div>
      <div className="flex-1 min-w-0">
        <div className="pl-2 py-1 flex justify-between w-full">
          <p className="dark:bg-dark-dark dark:text-white bg-gray-50 text-gray-500 text-xs font-semibold ">
            {sIcon?.name?.toLocaleUpperCase()}
          </p>
          <FontAwesomeIcon
            icon={settings?.synchronize ? ['fas', 'globe'] : ['far', 'hdd']}
            title={settings?.synchronize ? 'online' : 'offline'}
            className="text-1xl mr-2"
          />
        </div>
        {sIcon?.name === 'Recent Clipboards' && sIcon?.current && (
          <RecentClipboards />
        )}
        {sIcon?.name === 'Starred Clipboards' && sIcon?.current && (
          <StarredClipboards />
        )}
        {sIcon?.name === 'History' && sIcon?.current && <History />}
        {sIcon?.name === 'View more' && sIcon?.current && <ViewMore />}
      </div>
    </div>
  );
};

export default App;
