import create from 'zustand';
import { immer } from '../utils/util';
import { Clipboard } from '../../main/prisma/client/index';
import { SidebarIcon, SidebarIconName } from '../utils/contants';

type App = {
  sidebarIcons: SidebarIcon[];
  clipboards: Clipboard[];
  setSidebarIcon: (sidebarIconName: SidebarIconName) => void;
  setClipboards: (clipboards: Clipboard[]) => void;
};

const useAppStore = create<App>(
  immer(
    (set): App => ({
      sidebarIcons: [
        { name: 'Recent Clipboards', icon: ['fas', 'history'], current: true },
        { name: 'Starred Clipboards', icon: ['fas', 'star'], current: false },
        {
          name: 'History',
          icon: ['fas', 'search'],
          current: false,
        },
        {
          name: 'View more',
          icon: ['fas', 'ellipsis-h'],
          current: false,
        },
      ],
      clipboards: [],
      setSidebarIcon: (sidebarIconName) =>
        set((state) => {
          state.sidebarIcons = state.sidebarIcons.map((sidebarIcon) =>
            sidebarIcon.name === sidebarIconName
              ? { ...sidebarIcon, current: true }
              : { ...sidebarIcon, current: false }
          );
        }),
      setClipboards: (clipboards) =>
        set((state) => {
          state.clipboards = clipboards;
        }),
    })
  )
);

export default useAppStore;
