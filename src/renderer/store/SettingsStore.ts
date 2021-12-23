import { persist } from 'zustand/middleware';
import create from 'zustand';
import immer from '../utils/immer';

type Settings = {
  sync: 'offline' | 'online';
  hasHydrated: boolean;
  theme: boolean;
  changeTheme: () => void;
  startTheme: () => void;
  setSync: () => void;
};

const useSettingsStore = create<Settings>(
  persist(
    immer(
      (set): Settings => ({
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
            console.log(state.sync);
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
