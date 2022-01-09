import { ipcMain } from 'electron';
import fs from 'fs';
import { createTask, deleteTask } from '../../utils/scheduler';
import { PrismaClient } from '../../prisma/client/index';
import {
  DEFAULT_DB_CONFIG_PATH,
  prismaClientConfig,
} from '../../utils/constants';
import { localStorageHistory, syncDbLocationDialog } from '../../utils/util';

const prisma = new PrismaClient(prismaClientConfig());

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
  if (!fs.existsSync(DEFAULT_DB_CONFIG_PATH)) {
    await syncDbLocationDialog();
  }
  deleteTask();
  await createTask();
});

// SAVE, LOAD OR OVERWRITE DB IN SPECIFIC PATH
ipcMain.handle('selectDatabasePath', async () => {
  await syncDbLocationDialog();
});
