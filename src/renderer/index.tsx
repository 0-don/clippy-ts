/* eslint-disable no-console */
import ReactDOM from 'react-dom';
import { useEffect } from 'react';
import './index.css';
import './utils/icons';
import Routes from './Routes';
import useSettingsStore from './store/SettingsStore';
import { Prisma } from '../main/prisma/client';
import useAppStore from './store/AppStore';
import { ExtendedHotKey } from '../main/utils/constants';

const Index = () => {
  const initSettings = useSettingsStore((state) => state.initSettings);
  const settings = useSettingsStore((state) => state.settings);
  const updateSettings = useSettingsStore((state) => state.updateSettings);
  const updateHotkey = useSettingsStore((state) => state.updateHotkey);

  const setSidebarIcon = useAppStore((state) => state.setSidebarIcon);

  useEffect(() => {
    initSettings();

    const refreshSettings = window.electron.on(
      'refreshSettings',
      (setting: Prisma.SettingsCreateInput) => updateSettings(setting, false)
    );

    const refreshHotkeys = window.electron.on(
      'refreshHotkeys',
      (hotkey: ExtendedHotKey) => updateHotkey(hotkey, false)
    );

    return () => {
      refreshSettings();
      refreshHotkeys();
    };
  }, [updateSettings, updateHotkey, setSidebarIcon, initSettings]);

  if (!settings) return null;

  return <Routes />;
};

ReactDOM.render(<Index />, document.getElementById('root'));
