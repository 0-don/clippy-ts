import { ipcMain, dialog, app } from 'electron';
import fs from 'fs';
import path from 'path';
import { PrismaClient } from '../../prisma/client/index';
import {
  DEFAULT_DB_CONFIG_PATH,
  isDevelopment,
  DEFAULT_DB_PATH,
  prismaClientConfig,
} from '../../utils/constants';
import { localStorageHistory } from '../../utils/util';

const prisma = new PrismaClient(prismaClientConfig());

// READ DATABASE URL
ipcMain.handle('getDatbasePath', () =>
  fs.readFileSync(DEFAULT_DB_CONFIG_PATH, 'utf-8')
);

// GET DATABASE INFO
ipcMain.handle('getDatabaseInfo', async () => localStorageHistory());

// CLEAR DATABASE
ipcMain.handle('clearDatabase', async () => {
  await prisma.clipboard.deleteMany({ where: {} });
  await prisma?.$disconnect();
  return localStorageHistory();
});

// SAVE, LOAD OR OVERWRITE DB IN SPECIFIC PATH
ipcMain.handle('selectDatabasePath', async () => {
  const currentPath = fs.readFileSync(DEFAULT_DB_CONFIG_PATH, 'utf-8');
  const dialogResult = await dialog.showOpenDialog({
    properties: ['openDirectory'],
  });

  if (dialogResult.canceled) {
    return currentPath;
  }

  const dialogPath = path.join(dialogResult.filePaths[0], 'clippy.db');

  if (dialogPath === currentPath) {
    return currentPath;
  }
  const dbExists = fs.existsSync(dialogPath);
  await prisma?.$disconnect();

  const response =
    dbExists &&
    dialog.showMessageBoxSync({
      type: 'question',
      buttons: ['Load', 'Overwrite', 'Cancel'],
      title: 'Confirm',
      message: 'Clippy database already in the folder?',
    });

  // CANCEL
  if (response === 2) {
    return currentPath;
  }

  // LOAD
  if (response === 0) {
    fs.writeFileSync(DEFAULT_DB_CONFIG_PATH, dialogPath);
    if (!isDevelopment) {
      process.exit();
    } else {
      app.exit();
      app.relaunch();
    }
    return dialogPath;
  }

  // OVERWRITE
  // copy file to new location
  fs.copyFileSync(currentPath, dialogPath);
  if (!(currentPath === DEFAULT_DB_PATH)) {
    // delete old db
    fs.unlinkSync(currentPath);
  }
  // Write current DB url in to storage
  fs.writeFileSync(DEFAULT_DB_CONFIG_PATH, dialogPath);

  if (!isDevelopment) {
    process.exit();
  } else {
    app.exit();
    app.relaunch();
  }

  return dialogPath;
});
