import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState } from 'react';
import Shortcut from '../../elements/Shortcut';
import SwitchField from '../../elements/SwitchField';
import TextBlock from '../../elements/TextBlock';

const General: React.FC = () => {
  const [state, setState] = useState<boolean>(false);

  return (
    <>
      <TextBlock icon="cog" title="System">
        <div className="px-5 flex items-center space-x-2 pb-5 justify-between">
          <div className="flex items-center space-x-2 truncate">
            <FontAwesomeIcon icon="rocket" />
            <h6 className="text-sm">Start Clippy on system startup.</h6>
          </div>
          <div>
            <SwitchField checked={state} onChange={setState} />
          </div>
        </div>

        <div className="px-5 flex items-center space-x-2 pb-5 justify-between">
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
        <div className="px-5 space-x-5 pb-5 flex items-center">
          <Shortcut event="windowDisplayToggle" />
        </div>
      </TextBlock>
    </>
  );
};

export default General;
