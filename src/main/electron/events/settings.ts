import { ipcMain, webContents } from 'electron';
import { Hotkey, Prisma, PrismaClient } from '@prisma/client';
import { dbBackupTask } from '../../utils/scheduler';
import {
  ExtendedHotKey,
  HotkeyEvent,
  prismaClientConfig,
} from '../../utils/constants';
import toggleGlobalShortcutState from '../globalShortcut';
import { launchAtStartup } from '../../utils/util';

const prisma = new PrismaClient(prismaClientConfig);

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

    await dbBackupTask();
    await launchAtStartup();
    return setting;
  }
);

// DISABLE HOTKEYS
ipcMain.handle('disableHotkeys', async () => toggleGlobalShortcutState(false));

// GET HOTKEY
ipcMain.handle('getHotkey', (_, event: HotkeyEvent) =>
  prisma.hotkey.findFirst({ where: { event: { equals: event } } })
);

// GET HOTKEYS
ipcMain.handle('getHotkeys', () => prisma.hotkey.findMany());

// UPDATE HOTKEY
ipcMain.handle('updateHotkey', async (_, { id, ...hotkey }: ExtendedHotKey) => {
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

  await toggleGlobalShortcutState(true);

  webContents
    .getAllWebContents()
    .forEach((webContent) => webContent.send('refreshHotkeys', dbHotkey));

  return dbHotkey;
});
