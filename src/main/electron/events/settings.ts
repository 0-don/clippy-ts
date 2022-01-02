import { ipcMain } from 'electron';
import { Prisma, PrismaClient } from '../../prisma/client/index';
import { HotkeyEvent, prismaClientConfig } from '../../utils/constants';

const prisma = new PrismaClient(prismaClientConfig());

// GET SETTINGS
ipcMain.handle('getSettings', () =>
  prisma.settings.findFirst({ where: { id: 1 } })
);

// UPDATE SETTINGS
ipcMain.handle('updateSettings', (_, data: Prisma.SettingsCreateInput) =>
  prisma.settings.update({ where: { id: 1 }, data })
);

// GET HOTKEY
ipcMain.handle('getHotkey', (_, event: HotkeyEvent) =>
  prisma.hotkey.findFirst({ where: { event: { equals: event } } })
);

// UPDATE HOTKEY
ipcMain.handle('updateHotkey', (_, hotkey: Prisma.HotkeyCreateInput) =>
  prisma.hotkey.update({ where: { id: hotkey.id }, data: hotkey })
);
