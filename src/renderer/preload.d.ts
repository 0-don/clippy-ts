import { Prisma, Clipboard } from '@prisma/client';
import { Channel } from 'main/preload';
import { ExtendedHotKey } from '../main/utils/constants';

declare global {
  interface Window {
    electron: {
      getHotkeys(): unknown;
      ipcRenderer: {
        clearDatabase(): string;
        getDatabaseInfo(): string;
        getDatbasePath(): string;
        exit(): void;
        createAboutWindow(): void;
        createSettingsWindow(): void;
        toggleSyncClipboardHistory(): unknown;
        deleteClipboard(id: number): unknown;
        starClipboard(id: number): unknown;
        switchClipboard(arg0: Clipboard): void;
        page: string;

        getClipboards(obj: unknown): Promise<Clipboard[]>;
        version(): string | number | undefined;
        disableHotkeys(): unknown;
        getHotkeys(): ExtendedHotKey[];
        getSettings(): Prisma.SettingsCreateInput;
        updateSettings(settings: Prisma.SettingsCreateInput): unknown;
        updateHotkey(hotkey: ExtendedHotKey): unknown;
        sendMessage(channel: Channel, args: unknown[]): void;
        on(
          channel: string,
          func: (...args: unknown[]) => void
        ): (() => void) | undefined;
        once(channel: string, func: (...args: unknown[]) => void): void;
      };
    };
  }
}

export {};
