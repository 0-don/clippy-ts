import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState } from 'react';
import TextBlock from '../../elements/TextBlock';
import SwitchField from '../../elements/SwitchField';
import CheckBox from '../../elements/CheckBox';
import Dropdown from '../../elements/Dropdown';
import { GLOBAL_SHORTCUT_KEYS } from '../../utils/contants';

const General: React.FC = () => {
  const [state, setState] = useState<boolean>(false);

  return (
    <>
      <TextBlock icon="cog" title="System">
        <div className="px-5 flex items-center mb-2 space-x-2 pb-2.5 justify-between">
          <div className="flex items-center space-x-2 truncate">
            <FontAwesomeIcon icon="rocket" />
            <h6 className="text-sm">Start Clippy on system startup.</h6>
          </div>
          <div>
            <SwitchField checked={state} onChange={setState} />
          </div>
        </div>

        <div className="px-5 flex items-center mb-2 space-x-2 pb-2.5 justify-between">
          <div className="flex items-center space-x-2 truncate">
            <FontAwesomeIcon icon="bell" />
            <h6 className="text-sm">Show desktop notifications.</h6>
          </div>
          <div>
            <SwitchField checked={state} onChange={setState} />
          </div>
        </div>
      </TextBlock>

      <TextBlock icon={['far', 'keyboard']} title="Keyboard shorcut">
        <div className="px-5 mb-2 space-x-2 pb-2.5 flex">
          <CheckBox checked onChange={undefined} text="Ctrl" />
          <CheckBox checked onChange={undefined} text="Alt" />
          <CheckBox checked onChange={undefined} text="Shift" />
          <Dropdown items={GLOBAL_SHORTCUT_KEYS} />
        </div>
      </TextBlock>
    </>
  );
};

export default General;
