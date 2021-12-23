import useDarkModeStore from '../store/SettingsStore';
import SwitchField from './SwitchField';

const DarkMode: React.FC = () => {
  const { theme, hasHydrated, changeTheme } = useDarkModeStore();
  return <SwitchField checked={hasHydrated && theme} onChange={changeTheme} />;
};

export default DarkMode;
