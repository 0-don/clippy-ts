import { ipcMain, webContents, globalShortcut } from 'electron';
import { Prisma, PrismaClient } from '../../prisma/client/index';
import { HotkeyEvent, prismaClientConfig } from '../../utils/constants';
import createGlobalShortcuts from '../globalShortcut';

const prisma = new PrismaClient(prismaClientConfig());

// GET SETTINGS
ipcMain.handle('getSettings', () =>
  prisma.settings.findFirst({ where: { id: 1 } })
);

// UPDATE SETTINGS
ipcMain.handle(
  'updateSettings',
  async (_, { id, ...settings }: Prisma.SettingsCreateInput) => {
    const setting = await prisma.settings.update({
      where: { id: 1 },
      data: settings,
    });

    webContents
      .getAllWebContents()
      .forEach((webContent) => webContent.send('refreshSettings', setting));

    return setting;
  }
);

// GET HOTKEY
ipcMain.handle('getHotkey', (_, event: HotkeyEvent) =>
  prisma.hotkey.findFirst({ where: { event: { equals: event } } })
);

// UPDATE HOTKEY
ipcMain.handle(
  'updateHotkey',
  async (_, { id, ...hotkey }: Prisma.HotkeyCreateInput) => {
    globalShortcut.unregisterAll();

    const result = await prisma.hotkey.update({ where: { id }, data: hotkey });

    await createGlobalShortcuts();
    return result;
  }
);
