/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-console */
import ReactDOM from 'react-dom';
import { useEffect } from 'react';
import './index.css';
import './utils/icons';
import Routes from './Routes';
import useSettingsStore from './store/SettingsStore';

const Index = () => {
  const { initSettings, settings } = useSettingsStore();

  useEffect(() => {
    window.electron.once('ping', (arg: unknown) => {
      console.log(arg);
    });
    window.electron.myPing();
    initSettings();
  }, []);

  if (!settings) return null;

  return <Routes />;
};

ReactDOM.render(<Index />, document.getElementById('root'));
