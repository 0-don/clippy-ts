import { HashRouter, Routes, Route } from 'react-router-dom';
import About from './pages/About';
import App from './pages/App';
import Settings from './pages/Settings';

const Routing = () => {
  return (
    <HashRouter>
      <Routes>
        <Route path="/settings" element={<Settings />} />
        <Route path="/about" element={<About />} />
        <Route path="/" element={<App />} />
      </Routes>
    </HashRouter>
  );
};

export default Routing;
