import { globalShortcut } from 'electron';
import { prismaClientConfig, HotkeyEvent, getWindow } from '../utils/constants';
import { PrismaClient, Hotkey } from '../prisma/client';
import { displayWindowNearTray, hotkeyToAccelerator } from '../utils/util';
import { tray } from './tray';

const prisma = new PrismaClient(prismaClientConfig());
interface ExtendedHotKey extends Hotkey {
  event: HotkeyEvent;
}

async function createGlobalShortcuts() {
  let hotkey: ExtendedHotKey;
  const hotkeys = (await prisma.hotkey.findMany({
    where: {},
  })) as ExtendedHotKey[];

  hotkey = hotkeys.find(
    (key) => key.event === 'windowDisplayToggle'
  ) as ExtendedHotKey;
  globalShortcut.register(hotkeyToAccelerator(hotkey), () => {
    const window = getWindow('MAIN_WINDOW_ID');
    displayWindowNearTray(tray, window);
  });

  hotkey = hotkeys.find((key) => key.event === 'setTab') as ExtendedHotKey;
  globalShortcut.register(hotkeyToAccelerator(hotkey), () => {
    const window = getWindow('MAIN_WINDOW_ID');
    window.webContents.send('setTab', 'Recent Clipboards');
  });
}

export default createGlobalShortcuts;
