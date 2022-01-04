import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { HotkeyEvent } from '../../main/utils/constants';
import { Prisma } from '../../main/prisma/client';
import { GLOBAL_SHORTCUT_KEYS } from '../utils/contants';
import CheckBox from './CheckBox';
import Dropdown from './Dropdown';

interface ShortcutProps {
  event: HotkeyEvent;
}

const Shortcut: React.FC<ShortcutProps> = ({ event }) => {
  const [hotkey, setHotkey] = useState<Prisma.HotkeyCreateInput>();

  useEffect(() => {
    const getHotkey = async () =>
      setHotkey(await window.electron.getHotkey(event));
    getHotkey();
  }, [setHotkey, event]);

  useEffect(() => {
    const updateHotkey = async () => {
      if (hotkey)
        await window.electron.updateHotkey(hotkey as Prisma.HotkeyCreateInput);
    };
    updateHotkey();
  }, [hotkey]);

  if (!hotkey) {
    return null;
  }

  return (
    <>
      <FontAwesomeIcon icon="cut" className="text-xl" />
      <div className="flex items-center space-x-2 w-full">
        <CheckBox
          checked={hotkey.ctrl}
          onChange={() => setHotkey({ ...hotkey, ctrl: !hotkey.ctrl })}
          text="Ctrl"
        />
        <CheckBox
          checked={hotkey.alt}
          onChange={() => setHotkey({ ...hotkey, alt: !hotkey.alt })}
          text="Alt"
        />
        <CheckBox
          checked={hotkey.shift}
          onChange={() => setHotkey({ ...hotkey, shift: !hotkey.shift })}
          text="Shift"
        />
        <Dropdown
          items={GLOBAL_SHORTCUT_KEYS}
          value={hotkey.key}
          onChange={(key) => setHotkey({ ...hotkey, key })}
        />
        <p className="w-full flex justify-end truncate">{event}</p>
      </div>
    </>
  );
};

export default Shortcut;
