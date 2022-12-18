import React, { Dispatch, SetStateAction } from 'react';
import { Switch } from '@headlessui/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

type SwitchProps = {
  checked: boolean | undefined;
  onChange:
    | undefined
    | ((check: boolean) => void)
    | Dispatch<SetStateAction<boolean>>;
};

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

const SwitchField: React.FC<SwitchProps> = ({ checked, onChange }) => {
  return (
    <Switch
      checked={checked ?? false}
      as="div"
      onChange={(check: boolean) => onChange && onChange(check)}
      className="mx-1 flex-shrink-0 group relative rounded-full inline-flex items-center justify-center h-3 w-9 cursor-pointer z-10"
    >
      {checked && (
        <FontAwesomeIcon size="xs" className="text-white mr-3" icon="check" />
      )}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute w-full h-full rounded-md"
      />

      <span
        aria-hidden="true"
        className={classNames(
          checked ? 'border-white' : 'border-gray-500',
          'border-2 pointer-events-none absolute h-4 w-9 mx-auto rounded-full transition-colors ease-in-out duration-200'
        )}
      />
      <span
        aria-hidden="true"
        className={classNames(
          checked ? 'translate-x-6 bg-white' : 'translate-x-1 bg-gray-500 ',
          'flex items-center justify-center text-xs pointer-events-none absolute left-0 h-2 w-2 rounded-full shadow transform ring-0 transition-transform ease-in-out duration-200'
        )}
      />
    </Switch>
  );
};

export default SwitchField;
