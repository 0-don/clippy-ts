/* eslint-disable import/prefer-default-export */
import { Clipboard, Prisma } from '../../main/prisma/client/index';
import { GetClipboards, HotkeyEvent } from '../../main/utils/constants';

declare global {
  interface Window {
    electron: {
      once: (type: string, arg: unknown) => () => void;
      on: (type: string, arg: unknown) => () => void;

      // UTIL
      myPing: () => void;
      exit: () => Promise<boolean>;
      version: () => Promise<string>;

      // CLIPBOARD
      getClipboards: (arg: GetClipboards) => Promise<Clipboard[]>;
      deleteClipboard: (arg: number) => Promise<boolean>;
      starClipboard: (arg: number) => Promise<boolean>;
      switchClipboard: (arg: Clipboard) => Promise<boolean>;

      // WINDOW
      createAboutWindow: () => Promise<boolean>;
      createSettingsWindow: () => Promise<boolean>;

      // SETTINGS
      getSettings: () => Promise<Prisma.SettingsCreateInput>;
      updateSettings: (
        arg: Prisma.SettingsCreateInput
      ) => Promise<Prisma.SettingsCreateInput>;
      getHotkey: (arg: HotkeyEvent) => Promise<Prisma.HotkeyCreateInput>;
      updateHotkey: (
        arg: Prisma.HotkeyCreateInput
      ) => Promise<Prisma.HotkeyCreateInput>;

      // DATABASE
      getDatbasePath: () => Promise<string>;
      selectDatabasePath: () => Promise<string>;
      getDatabaseInfo: () => Promise<string>;
      clearDatabase: () => Promise<string>;
    };
  }
}

export const GLOBAL_SHORTCUT_KEYS = [
  'A',
  'B',
  'C',
  'D',
  'E',
  'F',
  'G',
  'H',
  'I',
  'J',
  'K',
  'L',
  'M',
  'N',
  'O',
  'P',
  'Q',
  'R',
  'S',
  'T',
  'U',
  'V',
  'W',
  'X',
  'Y',
  'Z',
  '0',
  '1',
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
  '9',
  'F1',
  'F2',
  'F3',
  'F4',
  'F5',
  'F6',
  'F7',
  'F8',
  'F9',
  'F10',
  'F11',
  'F12',
] as const;

export type GlobalShortcutKeysType = typeof GLOBAL_SHORTCUT_KEYS[number];
