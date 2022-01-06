import React from 'react';
import Shortcut from '../../elements/Shortcut';
import TextBlock from '../../elements/TextBlock';
import useSettingsStore from '../../store/SettingsStore';

const Hotkeys: React.FC = () => {
  const { hotkeys } = useSettingsStore();

  return (
    <>
      <TextBlock icon="key" title="Change your Hotkeys">
        <div className="overflow-visible w-full h-full">
          {hotkeys.map((hotkey) => (
            <div
              key={hotkey.id}
              className="px-5 flex items-center mb-2 space-x-2 pb-2.5"
            >
              <Shortcut hotkey={hotkey} />
            </div>
          ))}
          {/* {hotkeys.map((hotkey) => (
            <div
              key={hotkey.id}
              className="px-5 flex items-center mb-2 space-x-2 pb-2.5"
            >
              <Shortcut hotkey={hotkey} />
            </div>
          ))} */}
        </div>
      </TextBlock>
    </>
  );
};

export default Hotkeys;
