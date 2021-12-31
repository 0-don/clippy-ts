import { globalShortcut } from 'electron';
import {
  prismaClientConfig,
  HotkeyEvent,
  getWindow,
} from '../../utils/constants';
import { PrismaClient, Hotkey } from '../../prisma/client';
import { displayWindowNearTray, hotkeyToAccelerator } from '../../utils/util';
import tray from '../tray';

const prisma = new PrismaClient(prismaClientConfig());
interface ExtendedHotKey extends Hotkey {
  event: HotkeyEvent;
}

async function createGlobalShortcuts() {
  const hotkeys = (await prisma.hotkey.findMany({
    where: {},
  })) as ExtendedHotKey[];
  console.log(hotkeys);
  const windowDisplayToggle = hotkeys.find(
    (key) => key.event === 'windowDisplayToggle'
  ) as ExtendedHotKey;
  globalShortcut.register(hotkeyToAccelerator(windowDisplayToggle), () => {
    const window = getWindow('MAIN_WINDOW_ID');

    displayWindowNearTray(tray(), window);
  });
}

export default createGlobalShortcuts;
