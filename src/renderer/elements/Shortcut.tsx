import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { HotkeyEvent } from '../../main/utils/constants';
import useSettingsStore from '../store/SettingsStore';
import { GLOBAL_SHORTCUT_KEYS } from '../utils/contants';
import CheckBox from './CheckBox';
import Dropdown from './Dropdown';

interface ShortcutProps {
  event: HotkeyEvent;
}

const Shortcut: React.FC<ShortcutProps> = ({ event }) => {
  const { updateHotkey, hotkeys } = useSettingsStore();

  const currentHotkey = hotkeys.find((key) => key.event === event);

  if (!currentHotkey) {
    return null;
  }

  return (
    <>
      <div className="flex items-center space-x-2.5 w-full text-sm">
        <FontAwesomeIcon icon="cut" />

        {currentHotkey.status && (
          <>
            <CheckBox
              checked={currentHotkey.ctrl}
              onChange={() =>
                updateHotkey({ ...currentHotkey, ctrl: !currentHotkey.ctrl })
              }
              text="Ctrl"
            />
            <CheckBox
              checked={currentHotkey.alt}
              onChange={() =>
                updateHotkey({ ...currentHotkey, alt: !currentHotkey.alt })
              }
              text="Alt"
            />
            <CheckBox
              checked={currentHotkey.shift}
              onChange={() =>
                updateHotkey({ ...currentHotkey, shift: !currentHotkey.shift })
              }
              text="Shift"
            />
          </>
        )}
        <Dropdown
          items={GLOBAL_SHORTCUT_KEYS}
          value={currentHotkey.key}
          onChange={(key) => updateHotkey({ ...currentHotkey, key })}
        />
        <p className="w-full flex justify-end truncate">{currentHotkey.name}</p>
      </div>
    </>
  );
};

export default Shortcut;
