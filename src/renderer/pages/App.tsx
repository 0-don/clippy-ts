import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import StarredClipboards from '../components/app/StarredClipboards';
import AppSidebar from '../components/app/AppSidebar';
import useAppStore from '../store/AppStore';
import RecentClipboards from '../components/app/RecentClipboards';
import History from '../components/app/History';
import ViewMore from '../components/app/ViewMore';
import useSettingsStore from '../store/SettingsStore';

const App = () => {
  const { tab } = useAppStore();
  const { settings } = useSettingsStore();

  return (
    <div className="absolute w-full h-full dark:bg-dark bg-white dark:text-white text-black flex overflow-hidden ">
      <div className="dark:bg-dark-light bg-gray-200 flex flex-col items-center space-y-7 pt-3 px-1">
        <AppSidebar />
      </div>
      <div className="flex-1 min-w-0">
        <div className="pl-2 py-1 flex justify-between w-full">
          <p className="dark:bg-dark-dark dark:text-white bg-gray-50 text-gray-500 text-xs font-semibold ">
            {tab.toLocaleUpperCase()}
          </p>
          <FontAwesomeIcon
            icon={settings.synchronize ? ['fas', 'globe'] : ['far', 'hdd']}
            title={settings.synchronize ? 'online' : 'offline'}
            className="text-1xl mr-2"
          />
        </div>
        {tab === 'Recent Clipboards' && <RecentClipboards />}
        {tab === 'Starred Clipboards' && <StarredClipboards />}
        {tab === 'History' && <History />}
        {tab === 'View more' && <ViewMore />}
      </div>
    </div>
  );
};

export default App;
