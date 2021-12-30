/* eslint-disable import/prefer-default-export */
import { Clipboard } from '../../main/prisma/client/index';
import { GetClipboards } from '../../main/utils/constants';

declare global {
  interface Window {
    electron: {
      once: (type: string, arg: unknown) => () => void;
      on: (type: string, arg: unknown) => () => void;
      myPing: () => void;
      doAction: (arg: number[]) => string;
      getClipboards: (arg: GetClipboards) => Promise<Clipboard[]>;
      deleteClipboard: (arg: number) => Promise<boolean>;
      starClipboard: (arg: number) => Promise<boolean>;
      switchClipboard: (arg: Clipboard) => Promise<boolean>;
      exit: () => Promise<boolean>;
      createAboutWindow: () => Promise<boolean>;
      createSettingsWindow: () => Promise<boolean>;
      version: () => Promise<string>;
      getDatbasePath: () => Promise<string>;
      selectDatabasePath: () => Promise<string>;
      getDatabaseInfo: () => Promise<string>;
      clearDatabase: () => Promise<string>;
    };
  }
}

export const GLOBAL_SHORTCUT_KEYS = [
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
  'X',
  'Y',
  'Z',
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
];
