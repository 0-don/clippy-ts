import React, { useEffect } from 'react';
import useAppStore from '../../store/AppStore';
import Clipboards from './Clipboards';

const StarredClipboards: React.FC = () => {
  const setClipboards = useAppStore((state) => state.setClipboards);

  useEffect(() => {
    const getClipboards = async () =>
      setClipboards(await window.electron.getClipboards({ star: true }));
    getClipboards();
  }, [setClipboards]);

  return <Clipboards star />;
};

export default StarredClipboards;
