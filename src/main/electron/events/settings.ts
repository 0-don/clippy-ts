import { ipcMain, webContents, globalShortcut } from 'electron';
import { Hotkey, Prisma, PrismaClient } from '../../prisma/client/index';
import {
  ExtendedHotKey,
  HotkeyEvent,
  prismaClientConfig,
} from '../../utils/constants';
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

// GET HOTKEYS
ipcMain.handle('getHotkeys', () => prisma.hotkey.findMany());

// UPDATE HOTKEY
ipcMain.handle('updateHotkey', async (_, { id, ...hotkey }: ExtendedHotKey) => {
  globalShortcut.unregisterAll();

  let dbHotkey: Hotkey;
  if (hotkey.key === 'none') {
    dbHotkey = await prisma.hotkey.update({
      where: { id },
      data: { ...hotkey, status: false },
    });
  } else {
    dbHotkey = await prisma.hotkey.update({
      where: { id },
      data: { ...hotkey, status: true },
    });
  }

  await createGlobalShortcuts();

  // webContents
  //   .getAllWebContents()
  //   .forEach((webContent) => webContent.send('refreshHotkeys', dbHotkey));

  return dbHotkey;
});
