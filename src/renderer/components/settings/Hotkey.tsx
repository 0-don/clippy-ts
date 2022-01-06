import React from 'react';
import Shortcut from '../../elements/Shortcut';
import TextBlock from '../../elements/TextBlock';
import useSettingsStore from '../../store/SettingsStore';

const Hotkey: React.FC = () => {
  const { hotkeys } = useSettingsStore();

  return (
    <>
      {hotkeys.map(({ icon, name, event }) => (
        <TextBlock icon={JSON.parse(icon as string)} title={name}>
          <div className="px-5 flex items-center mb-2 space-x-2 pb-2.5">
            <Shortcut event={event} />
          </div>
        </TextBlock>
      ))}
    </>
  );
};

export default Hotkey;
