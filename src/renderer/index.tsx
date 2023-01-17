/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Prisma } from '@prisma/client';
import { useEffect } from 'react';
import { createRoot } from 'react-dom/client';
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

const container = document.getElementById('root')!;
const root = createRoot(container);
root.render(<Index />);

export default Index;
