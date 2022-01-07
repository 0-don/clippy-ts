/* eslint-disable import/no-cycle */
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
  const hotkeys = (await prisma.hotkey.findMany()) as ExtendedHotKey[];
  const mainWindow = getWindow('MAIN_WINDOW_ID');

  // MAIN HOTKEY
  // WINDOW DISPLAY TOGGLE
  const WDT = hotkeys.find(
    ({ event, status }) => event === 'windowDisplayToggle' && status
  ) as ExtendedHotKey;
  if (WDT)
    globalShortcut.register(hotkeyToAccelerator(WDT), async () => {
      displayWindowNearTray(tray, mainWindow);
      mainWindow.webContents.send('enableHotkey', true);
      await createGlobalShortcuts();
    });

  // IF ALL SHORTCUTS ENABLED && MAINWINDOW IS VISIBLE CREATE EVERYTHING
  if (allShortcuts && mainWindow.isVisible()) {
    // RECENT CLIPBOARDS
    const RC = hotkeys.find(
      ({ event, status }) => event === 'recentClipboards' && status
    ) as ExtendedHotKey;
    if (RC) {
      globalShortcut.register(hotkeyToAccelerator(RC), () =>
        mainWindow.webContents.send(RC.event, RC.name)
      );
    }

    // STARRED CLIPBOARDS
    const SC = hotkeys.find(
      ({ event, status }) => event === 'starredClipboards' && status
    ) as ExtendedHotKey;
    if (SC) {
      globalShortcut.register(hotkeyToAccelerator(SC), () =>
        mainWindow.webContents.send(SC.event, SC.name)
      );
    }

    // HISTORY
    const H = hotkeys.find(
      ({ event, status }) => event === 'history' && status
    ) as ExtendedHotKey;
    if (H) {
      globalShortcut.register(hotkeyToAccelerator(H), () =>
        mainWindow.webContents.send(H.event, H.name)
      );
    }

    // VIEW MORE
    const VM = hotkeys.find(
      ({ event, status }) => event === 'viewMore' && status
    ) as ExtendedHotKey;
    if (VM) {
      globalShortcut.register(hotkeyToAccelerator(VM), () =>
        mainWindow.webContents.send(VM.event, VM.name)
      );
    }
  }
}

export default createGlobalShortcuts;
