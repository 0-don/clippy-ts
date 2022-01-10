import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { ExtendedHotKey } from '../../main/utils/constants';
import useSettingsStore from '../store/SettingsStore';
import {
  GlobalShortcutKeysType,
  GLOBAL_SHORTCUT_KEYS,
} from '../utils/contants';
import CheckBox from './CheckBox';
import Dropdown from './Dropdown';

interface ShortcutProps {
  hotkey: ExtendedHotKey;
}

const Shortcut: React.FC<ShortcutProps> = ({ hotkey }) => {
  const updateHotkey = useSettingsStore((state) => state.updateHotkey);
  const { icon, status, ctrl, alt, shift, key, name } = hotkey;

  return (
    <>
      <div className="flex items-center space-x-2.5 w-full text-sm ">
        <div className="w-8">
          <FontAwesomeIcon icon={JSON.parse(icon)} className="relative" />
        </div>

        {status && (
          <>
            <CheckBox
              checked={ctrl}
              onChange={() => updateHotkey({ ...hotkey, ctrl: !ctrl })}
              text="Ctrl"
            />
            <CheckBox
              checked={alt}
              onChange={() => updateHotkey({ ...hotkey, alt: !alt })}
              text="Alt"
            />
            <CheckBox
              checked={shift}
              onChange={() => updateHotkey({ ...hotkey, shift: !shift })}
              text="Shift"
            />
          </>
        )}
        <Dropdown
          items={GLOBAL_SHORTCUT_KEYS}
          value={key}
          onChange={(currentKey) =>
            updateHotkey({
              ...hotkey,
              key: currentKey as GlobalShortcutKeysType,
              status: currentKey !== 'none',
            })
          }
        />
        <p className="w-full flex justify-end truncate">{name}</p>
      </div>
    </>
  );
};

export default Shortcut;
