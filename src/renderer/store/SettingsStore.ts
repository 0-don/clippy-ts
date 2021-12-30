import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { persist } from 'zustand/middleware';
import create from 'zustand';
import { immer } from '../utils/util';

type SettingsTabName = 'General' | 'Account' | 'History';

type SettingsTab = {
  name: SettingsTabName;
  icon: IconProp;
  current: boolean;
};

type Settings = {
  sync: 'offline' | 'online';
  tabs: SettingsTab[];
  hasHydrated: boolean;
  theme: boolean;
  changeTheme: () => void;
  startTheme: () => void;
  setSync: () => void;
  setCurrentTab: (tabName: SettingsTabName) => void;
};

const useSettingsStore = create<Settings>(
  persist(
    immer(
      (set): Settings => ({
        tabs: [
          { name: 'General', icon: 'cogs', current: false },
          { name: 'Account', icon: 'user', current: false },
          {
            name: 'History',
            icon: ['fas', 'history'],
            current: true,
          },
        ],
        sync: 'offline',
        hasHydrated: false,
        theme: true,
        changeTheme: () =>
          set((state) => {
            if (!state.theme) {
              state.theme = true;
              document.querySelector('html')?.classList?.add?.('dark');
            } else {
              state.theme = false;
              document.querySelector('html')?.classList?.remove?.('dark');
            }
          }),
        startTheme: () =>
          set((state) => {
            state.hasHydrated = true;

            if (state.theme) {
              document.querySelector('html')?.classList?.add?.('dark');
            } else {
              document.querySelector('html')?.classList?.remove?.('dark');
            }
          }),
        setSync: () =>
          set((state) => {
            state.sync = state.sync === 'online' ? 'offline' : 'online';
          }),
        setCurrentTab: (tabName) =>
          set((state) => {
            state.tabs = state.tabs.map((tab) =>
              tab.name === tabName
                ? { ...tab, current: true }
                : { ...tab, current: false }
            );
          }),
      })
    ),
    {
      name: 'DarkMode',
      serialize: (state) => JSON.stringify(state),
      deserialize: (storedState) => JSON.parse(storedState),
      partialize: (state) => {
        const { hasHydrated, ...fresh } = state;
        return fresh;
      },
    }
  )
);

export default useSettingsStore;
