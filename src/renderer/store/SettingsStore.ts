import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { persist } from 'zustand/middleware';
import create from 'zustand';
import { immer } from '../utils/util';
import { Prisma } from '../../main/prisma/client';
import { ExtendedHotKey } from '../../main/utils/constants';

type SettingsTabName = 'General' | 'Account' | 'History';

type SettingsTab = {
  name: SettingsTabName;
  icon: IconProp;
  current: boolean;
};

type Settings = {
  globalHotkeyEvent: boolean;
  setGlobalHotkeyEvent: (status: boolean) => void;

  hotkeys: ExtendedHotKey[];
  updateHotkey: (hotkey: ExtendedHotKey, update?: boolean) => void;

  settings: Prisma.SettingsCreateInput;
  initSettings: () => void;
  updateSettings: (
    settings: Prisma.SettingsCreateInput,
    update?: boolean
  ) => void;

  tabs: SettingsTab[];
  setCurrentTab: (tabName: SettingsTabName) => void;
};

const useSettingsStore = create<Settings>(
  persist(
    immer(
      (set, get): Settings => ({
        globalHotkeyEvent: true,

        hotkeys: undefined as unknown as ExtendedHotKey[],
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

        // SET CURRENT TAB
        setCurrentTab: (tabName) =>
          set((state) => {
            state.tabs = state.tabs.map((tab) =>
              tab.name === tabName
                ? { ...tab, current: true }
                : { ...tab, current: false }
            );
          }),

        // SET GLOBAL HOTKEY EVENT
        setGlobalHotkeyEvent: (status) => {
          set((state) => {
            state.globalHotkeyEvent = status;
          });
        },

        // UPDATE SETTINGS
        updateSettings: async (settings, upload = true) => {
          if (upload) await window.electron.updateSettings(settings);
          set((state) => {
            state.settings = settings;
          });
        },

        // UPDATE HOTKEYS
        updateHotkey: async (hotkey, upload = true) => {
          if (upload) await window.electron.updateHotkey(hotkey);
          set((state) => {
            state.hotkeys = state.hotkeys.map((key) =>
              key.id === hotkey.id ? hotkey : key
            );
          });
        },

        // INIT SETTINGS
        initSettings: async () => {
          const settings = await window.electron.getSettings();
          const hotkeys = await window.electron.getHotkeys();

          set((state) => {
            state.settings = settings;
            state.hotkeys = hotkeys;
          });

          if (get().settings.darkmode) {
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
        const { globalHotkeyEvent, ...fresh } = state;
        return fresh;
      },
    }
  )
);

export default useSettingsStore;
