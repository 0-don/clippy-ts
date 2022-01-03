import useSettingsStore from '../store/SettingsStore';

import SwitchField from './SwitchField';

const DarkMode: React.FC = () => {
  const { settings, updateSettings } = useSettingsStore();

  if (settings?.darkmode) {
    document.querySelector('html')?.classList?.add?.('dark');
  } else {
    document.querySelector('html')?.classList?.remove?.('dark');
  }

  return (
    <SwitchField
      checked={settings?.darkmode}
      onChange={() =>
        updateSettings({ ...settings, darkmode: !settings.darkmode })
      }
    />
  );
};

export default DarkMode;
