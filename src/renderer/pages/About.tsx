import { useEffect, useState } from 'react';
import icon from '../../../assets/clippy.png';

const About = () => {
  const [version, setVersion] = useState<string | number>();

  useEffect(() => {
    const getVersion = async () =>
      setVersion(await window.electron.ipcRenderer.version());
    getVersion();
  }, [setVersion]);

  return (
    <div className="space-y-2 absolute w-full h-full dark:bg-dark bg-white dark:text-white text-black flex flex-col items-center justify-center ">
      <img src={icon} alt="logo" width="300px" />
      <h1 className="text-xl font-bold">{version}</h1>
      <h2 className="text-base">No updates currently available</h2>
      <a
        href="https://github.com/Don-Cryptus/clippy"
        target="_blank"
        rel="noreferrer"
        className="w-28 inline-flex items-center justify-center px-2.5 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 "
      >
        Github
      </a>
      <a
        href="https://github.com/Don-Cryptus/clippy"
        target="_blank"
        rel="noreferrer"
        className="w-28 inline-flex items-center px-2.5 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 "
      >
        Official Website
      </a>
      <p className="text-xs">Developed by Don Cryptus. Powered by Electron.</p>
      <p className="text-xs text-gray-500">
        Copyright(C) DC. All right reserved.
      </p>
    </div>
  );
};

export default About;
