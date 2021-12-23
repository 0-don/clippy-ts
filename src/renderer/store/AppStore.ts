import create from 'zustand';
import immer from '../utils/immer';
import { Clipboard } from '../../main/prisma/client/index';

type AppTab =
  | 'Recent Clipboards'
  | 'Starred Clipboards'
  | 'History'
  | 'View more';

type App = {
  tab: AppTab;
  cursor?: number;
  clipboards: Clipboard[];
  setTab: (tab: AppTab) => void;
  setClipboards: (clipboards: Clipboard[]) => void;
};

const useAppStore = create<App>(
  immer(
    (set): App => ({
      tab: 'View more',
      cursor: undefined,
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
