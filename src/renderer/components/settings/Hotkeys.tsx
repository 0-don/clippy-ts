import React from 'react';
import Shortcut from '../../elements/Shortcut';
import TextBlock from '../../elements/TextBlock';
import useSettingsStore from '../../store/SettingsStore';

const Hotkeys: React.FC = () => {
  const { hotkeys } = useSettingsStore();

  return (
    <>
      <TextBlock icon="key" title="Change your Hotkeys">
        <div className="px-5 overflow-auto h-96">
          {hotkeys.map((hotkey, index) => (
            <div key={hotkey.id} className="">
              <div className="flex items-center px-0.5 py-4">
                <Shortcut hotkey={hotkey} />
              </div>
              {hotkeys.length !== index + 1 && <hr className="text-zinc-700" />}
            </div>
          ))}
        </div>
      </TextBlock>
    </>
  );
};

export default Hotkeys;
