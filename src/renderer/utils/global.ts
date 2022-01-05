import { Clipboard, Prisma } from '../../main/prisma/client/index';
import {
  ExtendedHotKey,
  GetClipboards,
  HotkeyEvent,
  OnEvent,
} from '../../main/utils/constants';

declare global {
  interface Window {
    electron: {
      on: (type: OnEvent, arg: unknown) => () => void;

      // UTIL
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
      getHotkey: (arg: HotkeyEvent) => Promise<ExtendedHotKey>;
      getHotkeys: () => Promise<ExtendedHotKey[]>;
      updateHotkey: (arg: ExtendedHotKey) => Promise<ExtendedHotKey>;

      // DATABASE
      getDatbasePath: () => Promise<string>;
      selectDatabasePath: () => Promise<string>;
      getDatabaseInfo: () => Promise<string>;
      clearDatabase: () => Promise<string>;
    };
  }
}
