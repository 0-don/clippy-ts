import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { persist } from 'zustand/middleware';
import create from 'zustand';
import { immer } from '../utils/util';
import { Prisma } from '../../main/prisma/client';

type SettingsTabName = 'General' | 'Account' | 'History';

type SettingsTab = {
  name: SettingsTabName;
  icon: IconProp;
  current: boolean;
};

type Settings = {
  settings: Prisma.SettingsCreateInput;
  sync: 'offline' | 'online';
  tabs: SettingsTab[];
  setCurrentTab: (tabName: SettingsTabName) => void;
  setSync: () => void;
  initSettings: () => void;
  updateSettings: (settings: Prisma.SettingsCreateInput) => void;
};

const useSettingsStore = create<Settings>(
  persist(
    immer(
      (set, get): Settings => ({
        settings: undefined as unknown as Prisma.SettingsCreateInput,
        tabs: [
          { name: 'General', icon: 'cogs', current: true },
          { name: 'Account', icon: 'user', current: false },
          {
            name: 'History',
            icon: ['fas', 'history'],
            current: false,
          },
        ],
        sync: 'offline',

        // updateSettings: (settings) => set((state) => {}),

        // CHANGE THEME

        // SET SYNC
        setSync: () =>
          set((state) => {
            state.sync = state.sync === 'online' ? 'offline' : 'online';
          }),

        // SET CURRENT TAB
        setCurrentTab: (tabName) =>
          set((state) => {
            state.tabs = state.tabs.map((tab) =>
              tab.name === tabName
                ? { ...tab, current: true }
                : { ...tab, current: false }
            );
          }),

        // UPDATE SETTINGS
        updateSettings: (settings) =>
          set((state) => {
            state.settings = settings;
          }),

        // INIT SETTINGS
        initSettings: async () => {
          if (!get().settings) {
            const settings = await window.electron.getSettings();
            set((state) => {
              state.settings = settings;
            });
          }

          if (get().settings?.darkmode) {
            document.querySelector('html')?.classList?.add?.('dark');
          } else {
            document.querySelector('html')?.classList?.remove?.('dark');
          }
        },
      })
    ),
    {
      name: 'settings',
      serialize: (state) => JSON.stringify(state),
      deserialize: (storedState) => JSON.parse(storedState),
      partialize: (state) => {
        const { ...fresh } = state;
        return fresh;
      },
    }
  )
);

export default useSettingsStore;
