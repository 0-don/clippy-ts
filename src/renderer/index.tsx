/* eslint-disable no-console */
import ReactDOM from 'react-dom';
import { useEffect } from 'react';
import './index.css';
import './utils/icons';
import Routes from './Routes';
import useSettingsStore from './store/SettingsStore';

const Index = () => {
  const { startTheme } = useSettingsStore();

  useEffect(() => {
    window.electron.once('ping', (arg: unknown) => {
      console.log(arg);
    });

    window.electron.myPing();
    startTheme();
  }, [startTheme]);

  return <Routes />;
};

ReactDOM.render(<Index />, document.getElementById('root'));
