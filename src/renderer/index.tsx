import ReactDOM from 'react-dom';
import { useEffect } from 'react';
import './index.css';
import './utils/icons';
import './utils/Types';
import Routes from './Routes';
import useDarkModeStore from './store/SettingsStore';
// import icon from '../../assets/icon.svg';

const Index = () => {
  const { startTheme } = useDarkModeStore();

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
