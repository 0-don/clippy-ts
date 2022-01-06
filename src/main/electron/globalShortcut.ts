import { globalShortcut } from 'electron';
import {
  prismaClientConfig,
  getWindow,
  ExtendedHotKey,
} from '../utils/constants';
import { PrismaClient } from '../prisma/client';
import { displayWindowNearTray, hotkeyToAccelerator } from '../utils/util';
import { tray } from './tray';

const prisma = new PrismaClient(prismaClientConfig());

async function createGlobalShortcuts(allShortcuts = true) {
  let hotkey: ExtendedHotKey | undefined;
  const hotkeys = (await prisma.hotkey.findMany()) as ExtendedHotKey[];

  // MAIN HOTKEY
  // WINDOW DISPLAY TOGGLE
  hotkey = hotkeys.find(
    ({ event, status }) => event === 'windowDisplayToggle' && status
  );
  if (hotkey)
    globalShortcut.register(hotkeyToAccelerator(hotkey), async () => {
      const window = getWindow('MAIN_WINDOW_ID');
      displayWindowNearTray(tray, window);
      if (window.isVisible()) {
        window.webContents.send('enableHotkey', true);
        await createGlobalShortcuts();
      }
    });

  // IF ALL SHORTCUTS ENABLED CREATE EVERYTHING
  if (allShortcuts) {
    // SET TAB
    hotkey = hotkeys.find(({ event, status }) => event === 'setTab' && status);
    if (hotkey)
      globalShortcut.register(hotkeyToAccelerator(hotkey), () => {
        const window = getWindow('MAIN_WINDOW_ID');
        if (window.isVisible())
          window.webContents.send('setTab', 'Recent Clipboards');
      });
  }
}

export default createGlobalShortcuts;
