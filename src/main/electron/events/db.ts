import { ipcMain, webContents } from 'electron';
import fs from 'fs';
import { Prisma, PrismaClient } from '../../prisma/client/index';
import { DEFAULT_DB_CONFIG_PATH } from '../../utils/constants';
import { dbBackupTask } from '../../utils/scheduler';
import { localStorageHistory, syncDbLocationDialog } from '../../utils/util';

const prisma = new PrismaClient();

// READ DATABASE URL
ipcMain.handle(
  'getDatbasePath',
  () =>
    fs.existsSync(DEFAULT_DB_CONFIG_PATH) &&
    fs.readFileSync(DEFAULT_DB_CONFIG_PATH, 'utf-8')
);

// GET DATABASE INFO
ipcMain.handle('getDatabaseInfo', async () => localStorageHistory());

// CLEAR DATABASE
ipcMain.handle('clearDatabase', async () => {
  await prisma.clipboard.deleteMany({ where: {} });
  await prisma.$disconnect();
  return localStorageHistory();
});

// TOGGLE SYNC CLIPBOARD HISTORY
ipcMain.handle('toggleSyncClipboardHistory', async () => {
  const { synchronize } = (await prisma.settings.findFirst({
    where: { id: 1 },
  })) as Prisma.SettingsCreateInput;

  const updateSettings = await prisma.settings.update({
    where: { id: 1 },
    data: { synchronize: !synchronize },
  });

  if (updateSettings && !fs.existsSync(DEFAULT_DB_CONFIG_PATH)) {
    await syncDbLocationDialog();
  }
  await dbBackupTask();

  webContents
    .getAllWebContents()
    .forEach((webContent) =>
      webContent.send('refreshSettings', updateSettings)
    );
});

// SAVE, LOAD OR OVERWRITE DB IN SPECIFIC PATH
ipcMain.handle('selectDatabasePath', async () => {
  const location = await syncDbLocationDialog();
  await dbBackupTask();
  return location;
});
