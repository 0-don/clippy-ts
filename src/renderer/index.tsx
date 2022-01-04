/* eslint-disable no-console */
import ReactDOM from 'react-dom';
import { useEffect } from 'react';
import './index.css';
import './utils/icons';
import Routes from './Routes';
import useSettingsStore from './store/SettingsStore';
import { Prisma } from '../main/prisma/client';

const Index = () => {
  const { initSettings, settings, updateSettings } = useSettingsStore();

  useEffect(() => {
    window.electron.once('ping', (arg: unknown) => {
      console.log(arg);
    });
    window.electron.myPing();
    initSettings();
  }, [initSettings]);

  useEffect(() => {
    window.electron.on(
      'refreshSettings',
      (setting: Prisma.SettingsCreateInput) => updateSettings(setting, false)
    );

    // window.electron.on("re")
  }, [updateSettings]);

  useEffect(() => {
    // setTimeout(() => {}, timeout);
  }, []);

  if (!settings) return null;

  return <Routes />;
};

ReactDOM.render(<Index />, document.getElementById('root'));
