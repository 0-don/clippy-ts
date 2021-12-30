import { ipcMain } from 'electron';
import {
  prismaClientConfig,
  getWindow,
  HotkeyEvent,
} from '../../utils/constants';
import { PrismaClient, Prisma } from '../../prisma/client';

const prisma = new PrismaClient(prismaClientConfig());

// GET HOTKEY
ipcMain.handle('getHotkey', async (_, event: HotkeyEvent) =>
  prisma.hotkey.findFirst({ where: { event: { equals: event } } })
);

// // EXIT
// ipcMain.handle(
//   'windowDisplayToggle',
//   async (_, hotkey: Prisma.HotkeyCreateInput) => {
//     const window = getWindow('MAIN_WINDOW_ID');
//     const dbHotkey = await prisma.hotkey.findFirst({
//       where: { id: hotkey.id },
//     });
//     const dbHotkeyUpdate = await prisma.hotkey.update({
//       where: { id: hotkey.id },
//       data: hotkey,
//     });

//     if (window?.isVisible()) {
//       window.show();
//     } else {
//       window?.hide();
//     }
//   }
// );
