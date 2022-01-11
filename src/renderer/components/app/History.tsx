import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import useAppStore from '../../store/AppStore';
import Clipboards from './Clipboards';
import SwitchField from '../../elements/SwitchField';
import useSettingsStore from '../../store/SettingsStore';

const History: React.FC = () => {
  const [search, setSearch] = useState('');
  const [showImages, setShowImages] = useState(false);
  const { setGlobalHotkeyEvent } = useSettingsStore();
  const setClipboards = useAppStore((state) => state.setClipboards);

  useEffect(() => {
    const getClipboards = async () =>
      setClipboards(await window.electron.getClipboards({}));
    getClipboards();
  }, [setClipboards]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(
      async () =>
        setClipboards(
          await window.electron.getClipboards({
            search: showImages ? undefined : search,
            showImages,
          })
        ),
      0
    );

    return () => clearTimeout(delayDebounceFn);
  }, [search, setClipboards, showImages]);

  return (
    <>
      <div className="px-3 py-2 bg-zinc-800 flex items-center j">
        <div className="relative w-full">
          <input
            placeholder="search"
            className="border-gray-300 w-full px-3 py-0.5 dark:bg-dark-light dark:border-dark-light dark:text-white border rounded-md focus:outline-none dark:focus:bg-dark-dark"
            type="text"
            onFocus={async () => {
              setGlobalHotkeyEvent(false);
              await window.electron.disableHotkeys();
            }}
            value={search}
            onChange={(e) => {
              setShowImages(false);
              setSearch(e.target.value);
            }}
          />
          <div className="absolute inset-y-0 right-1 flex items-center">
            <FontAwesomeIcon icon="search" />
          </div>
        </div>
        <div className="pl-2 flex items-center">
          <FontAwesomeIcon icon="images" className="text-2xl" />
          <SwitchField checked={showImages} onChange={setShowImages} />
        </div>
      </div>

      <Clipboards search={search} />
    </>
  );
};

export default History;
