import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import useSettingsStore from '../store/SettingsStore';

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

const Settings = () => {
  const { tabs, setCurrentTab } = useSettingsStore();
  return (
    <div className="border-b border-gray-500">
      <nav className="-mb-px flex space-x-8" aria-label="Tabs">
        {tabs.map((tab, i) => (
          <div
            key={tab.name}
            role="button"
            tabIndex={i}
            onKeyDown={() => {}}
            className={classNames(
              tab.current
                ? 'border-white text-white'
                : 'border-transparent text-gray-500 hover:text-white hover:border-white',
              'group inline-flex items-center py-4 px-3 border-b-2 font-medium text-sm'
            )}
            aria-current={tab.current ? 'page' : undefined}
            onClick={() => setCurrentTab(tab.name)}
          >
            <FontAwesomeIcon
              icon={tab.icon as IconProp}
              className="text-1xl mr-2"
            />
            <span>{tab.name}</span>
          </div>
        ))}
      </nav>
    </div>
  );
};

export default Settings;
