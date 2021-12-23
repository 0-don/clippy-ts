/* eslint-disable no-console */
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import {
  ipcMain,
  nativeImage,
  app,
  BrowserWindow,
  nativeTheme,
  shell,
} from 'electron';
import clipboard from 'electron-clipboard-extended';
import path from 'path';
import { getMainWindow } from './etc/constants';
import { formatBytes, resolveHtmlPath } from './etc/util';
import MenuBuilder from './menu';
import { PrismaClient, Clipboard } from './prisma/client/index';

export type GetClipboards = {
  cursor?: number;
  star?: boolean;
  search?: string;
  showImages?: boolean;
};

dayjs.extend(customParseFormat);
const prisma = new PrismaClient();
let addClipboard = true;

clipboard
  .on('text-changed', async () => {
    const mainWindow = getMainWindow();
    const content = clipboard.readText();

    const re = /^(?:[0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/;
    const type = re.test(content) ? 'palette' : 'file';
    const typeName = re.test(content) ? 'Color Detected' : 'Text Detected';

    console.log(typeName, dayjs().format('H:mm:ss'));

    if (addClipboard && content.replace(' ', '').length > 0) {
      const clip = await prisma.clipboard.create({
        data: { content, type },
      });
      mainWindow?.webContents.send('addClipboard', clip);
    }
    addClipboard = true;
  })
  .on('image-changed', async () => {
    console.log('Image Detected', dayjs().format('H:mm:ss'));

    const mainWindow = getMainWindow();
    const image = clipboard.readImage();

    if (addClipboard) {
      const clip = await prisma.clipboard.create({
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

ipcMain.on('ipc-example', async (event, arg) => {
  const msgTemplate = (pingPong: string) => `IPC test: ${pingPong}`;
  console.log(msgTemplate(arg));
  event.reply('ipc-example', msgTemplate('pong'));
});

// GET CLIPBOARDS
ipcMain.handle(
  'getClipboards',
  async (_, { cursor, star, search, showImages }: GetClipboards) => {
    const take = 16;

    // console.log('cursor:', cursor, 'star:', star, 'search:', search);

    const clipboards = await prisma.clipboard.findMany({
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

    return cursor ? clipboards.sort((a, b) => b.id - a.id) : clipboards;
  }
);

// SWITCH CLIPBOARD
ipcMain.handle(
  'switchClipboard',
  async (_, { type, blob, content }: Clipboard) => {
    console.log('Switch', dayjs().format('H:mm:ss'));

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
  await prisma.clipboard.delete({
    where: { id },
  });
  return true;
});

// STAR CLIPBOARD
ipcMain.handle('starClipboard', async (_, id: number) => {
  const clip = await prisma.clipboard.findFirst({
    where: { id },
  });
  await prisma.clipboard.update({
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

// OPEN ABOUT PAGE WINDOW
ipcMain.handle('createAboutWindow', async () => {
  const RESOURCES_PATH = app.isPackaged
    ? path.join(process.resourcesPath, 'assets')
    : path.join(__dirname, '../../assets');

  const getAssetPath = (...paths: string[]): string => {
    return path.join(RESOURCES_PATH, ...paths);
  };

  const widthHeight = app.isPackaged
    ? {
        height: 600,
        width: 375,
      }
    : {
        height: 820,
        width: 728,
      };

  let aboutWindow: BrowserWindow | null = new BrowserWindow({
    ...widthHeight,
    show: false,
    // frame: false,
    backgroundColor: nativeTheme.shouldUseDarkColors ? '#1c1c1c' : '#ffffff',
    icon: getAssetPath('icon.png'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  process.env.ABOUT_WINDOW_ID = `${aboutWindow.id}`;

  // mainWindow.loadURL(resolveHtmlPath('index.html#/settings'));
  aboutWindow.loadURL(resolveHtmlPath('index.html#/about'));

  aboutWindow.on('ready-to-show', () => {
    if (!aboutWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    if (process.env.START_MINIMIZED) {
      aboutWindow.minimize();
    } else {
      aboutWindow.show();
    }
  });

  aboutWindow.on('closed', () => {
    aboutWindow = null;
  });

  const menuBuilder = new MenuBuilder(aboutWindow);
  menuBuilder.buildMenu();

  // Open urls in the user's browser
  aboutWindow.webContents.on('new-window', (event, url) => {
    event.preventDefault();
    shell.openExternal(url);
  });

  return true;
});

// EXIT
ipcMain.handle('version', async () => app.getVersion());
