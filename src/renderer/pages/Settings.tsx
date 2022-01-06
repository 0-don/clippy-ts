import useSettingsStore from '../store/SettingsStore';
import Tabs from '../elements/Tabs';
import Account from '../components/settings/Account';
import General from '../components/settings/General';
import History from '../components/settings/History';
import Hotkeys from '../components/settings/Hotkeys';

const Settings = () => {
  const tabs = useSettingsStore((state) => state.tabs);
  const currentTab = tabs.find((tab) => tab.current)?.name;

  return (
    <div className="absolute w-full h-full dark:bg-dark bg-white dark:text-white text-black flex flex-col overflow-hidden">
      <Tabs />
      <div className="p-5 dark:text-white">
        {currentTab === 'General' && <General />}
        {currentTab === 'Account' && <Account />}
        {currentTab === 'History' && <History />}
        {currentTab === 'Hotkeys' && <Hotkeys />}
      </div>
    </div>
  );
};

export default Settings;
