import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import StarredClipboards from '../components/app/StarredClipboards';
import AppSidebar from '../components/app/AppSidebar';
import useAppStore from '../store/AppStore';
import RecentClipboards from '../components/app/RecentClipboards';
import History from '../components/app/History';
import ViewMore from '../components/app/ViewMore';
import useSettingsStore from '../store/SettingsStore';

const App = () => {
  const { sidebarIcons } = useAppStore();
  const { settings } = useSettingsStore();

  const sIcon = sidebarIcons.find((icon) => icon.current);

  return (
    <div className="absolute w-full h-full dark:bg-dark bg-white dark:text-white text-black flex overflow-hidden ">
      <div className="dark:bg-dark-light bg-gray-200 flex flex-col items-center space-y-7 pt-3 px-3">
        <AppSidebar />
      </div>
      <div className="flex-1 min-w-0">
        <div className="pl-2 py-1 flex justify-between w-full">
          <p className="dark:bg-dark-dark dark:text-white bg-gray-50 text-gray-500 text-xs font-semibold ">
            {sIcon?.name?.toLocaleUpperCase()}
          </p>
          <FontAwesomeIcon
            icon={settings.synchronize ? ['fas', 'globe'] : ['far', 'hdd']}
            title={settings.synchronize ? 'online' : 'offline'}
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
