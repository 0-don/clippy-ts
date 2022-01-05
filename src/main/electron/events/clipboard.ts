import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import clipboard from 'electron-clipboard-extended';
import { ipcMain, nativeImage } from 'electron';
import { log } from 'console';
import { PrismaClient, Clipboard } from '../../prisma/client';
import {
  GetClipboards,
  getWindow,
  prismaClientConfig,
} from '../../utils/constants';
import { formatBytes } from '../../utils/util';

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
      mainWindow.webContents.send('addClipboard', clip);
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

      mainWindow.webContents.send('addClipboard', clip);
    }
    addClipboard = true;
  })
  .startWatching();

// GET CLIPBOARDS
ipcMain.handle(
  'getClipboards',
  async (_, { cursor, star, search, showImages }: GetClipboards) => {
    const take = 16;

    // log('cursor:', cursor, 'star:', star, 'search:', search);

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
