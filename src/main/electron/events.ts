/* eslint-disable no-console */
import dayjs from 'dayjs';
import path from 'path';
import fs from 'fs';
import { log } from 'console';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { app, dialog, ipcMain, nativeImage } from 'electron';
import clipboard from 'electron-clipboard-extended';
import {
  DEFAULT_DB_CONFIG_PATH,
  DEFAULT_DB_PATH,
  GetClipboards,
  getWindow,
  isDevelopment,
  prismaClientConfig,
} from '../utils/constants';
import { formatBytes } from '../utils/util';
import { Clipboard, PrismaClient } from '../prisma/client/index';

dayjs.extend(customParseFormat);

const prisma = new PrismaClient(prismaClientConfig());

// CLIPBOARD EVENT LISTENER
let addClipboard = true;
clipboard
  // TEXT CHANGED
  .on('text-changed', async () => {
    const mainWindow = getWindow('MAIN_WINDOW_ID');
    const content = clipboard.readText();

    const re = /^(?:[0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/;
    const type = re.test(content) ? 'palette' : 'file';
    const typeName = re.test(content) ? 'Color Detected' : 'Text Detected';

    log(typeName, dayjs().format('H:mm:ss'));

    if (addClipboard && content.replace(' ', '').length > 0) {
      const clip = await prisma?.clipboard.create({
        data: { content, type },
      });
      mainWindow?.webContents.send('addClipboard', clip);
    }
    addClipboard = true;
  })
  // IMAGE CHANGED
  .on('image-changed', async () => {
    log('Image Detected', dayjs().format('H:mm:ss'));

    const mainWindow = getWindow('MAIN_WINDOW_ID');
    const image = clipboard.readImage();

    if (addClipboard) {
      const clip = await prisma?.clipboard.create({
        data: {
          width: image.getSize().width,
          height: image.getSize().height,
          size: formatBytes(image.toPNG().byteLength),
          blob: image.toPNG(),
          type: 'file-image',
        },
      });

      mainWindow?.webContents.send('addClipboard', clip);
    }
    addClipboard = true;
  })
  .startWatching();

ipcMain.on('ping', async (event, arg) => {
  const msgTemplate = (pingPong: string) => `IPC test: ${pingPong}`;
  log(msgTemplate(arg));
  event.reply('ping', msgTemplate('pong'));
});

// GET CLIPBOARDS
ipcMain.handle(
  'getClipboards',
  async (_, { cursor, star, search, showImages }: GetClipboards) => {
    const take = 16;

    // log('cursor:', cursor, 'star:', star, 'search:', search);

    const clipboards = await prisma?.clipboard.findMany({
      take: take * (cursor ? -1 : 1),
      skip: cursor ? 1 : undefined,
      where: {
        star,
        content: { contains: search },
        size: { gt: showImages ? '0' : undefined },
      },
      cursor: cursor ? { id: cursor } : undefined,
      orderBy: cursor ? undefined : [{ id: 'desc' }],
    });

    return cursor ? clipboards?.sort((a, b) => b.id - a.id) : clipboards;
  }
);

// SWITCH CLIPBOARD
ipcMain.handle(
  'switchClipboard',
  async (_, { type, blob, content }: Clipboard) => {
    log('Switch', dayjs().format('H:mm:ss'));

    addClipboard = false;
    if (type === 'file-image' && blob) {
      const img = nativeImage.createFromBuffer(blob);
      clipboard.writeImage(img);
    } else if (content) {
      clipboard.writeText(content);
    }

    return true;
  }
);

// DELETE CLIPBOARD
ipcMain.handle('deleteClipboard', async (_, id: number) => {
  await prisma?.clipboard.delete({
    where: { id },
  });
  return true;
});

// STAR CLIPBOARD
ipcMain.handle('starClipboard', async (_, id: number) => {
  const clip = await prisma?.clipboard.findFirst({
    where: { id },
  });
  await prisma?.clipboard.update({
    where: { id },
    data: { star: !clip?.star },
  });
  return !clip?.star;
});

// EXIT
ipcMain.handle('exit', async () => {
  app.quit();
  return true;
});

// VERSION
ipcMain.handle('version', async () => app.getVersion());

// READ DATABASE URL
ipcMain.handle('getDatbasePath', () =>
  fs.readFileSync(DEFAULT_DB_CONFIG_PATH, 'utf-8')
);

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
