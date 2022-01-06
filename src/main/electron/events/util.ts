import { app, globalShortcut, ipcMain } from 'electron';
import { PrismaClient } from '../../prisma/client';
import { prismaClientConfig } from '../../utils/constants';
import createGlobalShortcuts from '../globalShortcut';

const prisma = new PrismaClient(prismaClientConfig());

// EXIT
ipcMain.handle('exit', () => app.quit());

// VERSION
ipcMain.handle('version', async () => app.getVersion());

// DISABLE HOTKEYS
ipcMain.handle('disableHotkeys', async () => {
  // const hotkeys = await prisma.hotkey.findMany({ where: { NOT: { id: 1 } } });

  // globalShortcut.removeAllListeners();
  globalShortcut.unregisterAll();
  // hotkeys.forEach((key) => globalShortcut.removeAllListeners(key.event));

  await createGlobalShortcuts(false);
});
