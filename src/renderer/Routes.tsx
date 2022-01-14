import { useState, useEffect } from 'react';
import About from './pages/About';
import App from './pages/App';
import Settings from './pages/Settings';

const Routing = () => {
  const [page, setPage] = useState<string>();

  useEffect(() => {
    setPage(window.electron.page);
  }, [setPage]);

  return (
    <>
      {page === 'home' && <App />}
      {page === 'about' && <About />}
      {page === 'settings' && <Settings />}
    </>
  );
};

export default Routing;
