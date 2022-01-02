/* eslint-disable react/prop-types */
import { Fragment, useState } from 'react';
import { Listbox, Transition } from '@headlessui/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { classNames } from '../utils/util';

interface DropdownProps {
  items: string[];
  value: string;
}

const Dropdown: React.FC<DropdownProps> = ({ items, value }) => {
  const [selectedState, setSelectedState] = useState(value);

  return (
    <Listbox value={value} onChange={setSelectedState}>
      {({ open }) => (
        <>
          <div className="mt-1 relative ">
            <Listbox.Button className="flex w-16 items-center justify-between space-x-2.5 border-gray-300 px-2 dark:bg-dark-light dark:border-dark-light dark:text-white border rounded-md focus:outline-none dark:focus:bg-dark-dark">
              <span className="block text-lg font-semibold truncate text-white w-full">
                {selectedState}
              </span>
              <FontAwesomeIcon size="xs" className="text-white" icon="sort" />
            </Listbox.Button>

            <Transition
              show={open}
              as={Fragment}
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Listbox.Options className="absolute z-10 mt-0.5 w-full bg-dark-light shadow-lg max-h-16 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
                {items?.map((item) => (
                  <Listbox.Option
                    key={item}
                    className={({ active }) =>
                      classNames(
                        active ? 'text-white bg-indigo-600' : 'text-white',
                        'cursor-default select-none relative py-1 pl-3 '
                      )
                    }
                    value={item}
                  >
                    {({ selected, active }) => (
                      <>
                        <span
                          className={classNames(
                            selected ? 'font-semibold' : 'font-normal',
                            'block truncate'
                          )}
                        >
                          {item}
                        </span>

                        {selected ? (
                          <span
                            className={classNames(
                              active ? 'text-white' : 'text-indigo-600',
                              'absolute inset-y-0 right-0 flex items-center pr-1'
                            )}
                          >
                            <FontAwesomeIcon
                              size="xs"
                              className="text-white"
                              icon="check"
                            />
                          </span>
                        ) : null}
                      </>
                    )}
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </Transition>
          </div>
        </>
      )}
    </Listbox>
  );
};

export default Dropdown;
