import React, { useEffect, useState } from 'react';
import icon from '../../../assets/icon.svg';

const About: React.FC = () => {
  const [version, setVersion] = useState<string | number>();

  useEffect(() => {
    const getVersion = async () => setVersion(await window.electron.version());
    getVersion();
  }, [setVersion]);

  return (
    <div className="absolute w-full h-full dark:bg-dark bg-white dark:text-white text-black flex overflow-hidden items-center justify-center ">
      <img src={icon} alt="" width="25%" />
      <p>{version}</p>
    </div>
  );
};

export default About;
