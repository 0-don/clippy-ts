/* eslint-disable no-console */
import ReactDOM from 'react-dom';
import { useEffect } from 'react';
import './index.css';
import './utils/icons';
import Routes from './Routes';
import useSettingsStore from './store/SettingsStore';
import { Prisma } from '../main/prisma/client';
import useAppStore from './store/AppStore';
import { AppTab } from './utils/contants';

const Index = () => {
  const { initSettings, settings, updateSettings } = useSettingsStore();
  const { setTab } = useAppStore();

  useEffect(() => {
    initSettings();

    window.electron.on(
      'refreshSettings',
      (setting: Prisma.SettingsCreateInput) => updateSettings(setting, false)
    );

    window.electron.on('setTab', (tab: AppTab) => setTab(tab));
  }, [updateSettings, setTab, initSettings]);

  if (!settings) return null;

  return <Routes />;
};

ReactDOM.render(<Index />, document.getElementById('root'));
