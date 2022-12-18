import { Prisma } from '@prisma/client';
import { useEffect } from 'react';
import ReactDOM from 'react-dom';
import { ExtendedHotKey } from '../main/utils/constants';
import './index.css';
import Routing from './Routes';
import useAppStore from './store/AppStore';
import useSettingsStore from './store/SettingsStore';
import './utils/icons';

const Index = () => {
  const { initSettings, settings, updateSettings, updateHotkey } =
    useSettingsStore();
  const { setSidebarIcon } = useAppStore();

  useEffect(() => {
    initSettings();

    const refreshSettings = window.electron.ipcRenderer.on(
      'refreshSettings',
      (setting) => {
        updateSettings(setting as Prisma.SettingsCreateInput, false);
        initSettings();
      }
    );

    const refreshHotkeys = window.electron.ipcRenderer.on(
      'refreshHotkeys',
      (hotkey) => updateHotkey(hotkey as ExtendedHotKey, false)
    );

    return () => {
      if (refreshSettings) refreshSettings();
      if (refreshHotkeys) refreshHotkeys();
    };
  }, [updateSettings, updateHotkey, setSidebarIcon, initSettings]);

  if (!settings) return null;

  return <Routing />;
};

ReactDOM.render(<Index />, document.getElementById('root'));

export default Index;
