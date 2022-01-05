import create from 'zustand';
import { immer } from '../utils/util';
import { Clipboard } from '../../main/prisma/client/index';
import { AppTab } from '../utils/contants';

type App = {
  tab: AppTab;
  clipboards: Clipboard[];
  setTab: (tab: AppTab) => void;
  setClipboards: (clipboards: Clipboard[]) => void;
};

const useAppStore = create<App>(
  immer(
    (set): App => ({
      tab: 'Recent Clipboards',
      clipboards: [],
      setTab: (tab) =>
        set((state) => {
          state.tab = tab;
        }),
      setClipboards: (clipboards) =>
        set((state) => {
          state.clipboards = clipboards;
        }),
    })
  )
);

export default useAppStore;
