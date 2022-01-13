/* eslint-disable import/no-cycle */
import { globalShortcut, webContents } from 'electron';
import { PrismaClient } from '@prisma/client';
import {
  getWindow,
  ExtendedHotKey,
  HotkeyEvent,
  prismaClientConfig,
} from '../utils/constants';
import { displayWindowNearTray, hotkeyToAccelerator } from '../utils/util';
import { tray } from './tray';

const prisma = new PrismaClient(prismaClientConfig);

const createGlobalShortcut = (
  hotkeys: ExtendedHotKey[],
  eventname: HotkeyEvent,
  func: (key: ExtendedHotKey) => void
) => {
  const key = hotkeys.find(
    ({ event, status }) => event === eventname && status
  );
  if (key) {
    globalShortcut.register(hotkeyToAccelerator(key), () => func(key));
  }
};

async function createGlobalShortcuts(allShortcuts = true) {
  const hotkeys = (await prisma.hotkey.findMany()) as ExtendedHotKey[];
  const mainWindow = getWindow('MAIN_WINDOW_ID');

  // MAIN HOTKEY
  // WINDOW DISPLAY TOGGLE
  createGlobalShortcut(hotkeys, 'windowDisplayToggle', () =>
    displayWindowNearTray(tray, mainWindow)
  );

  // TOGGLE DEVELOPER TOOLS
  createGlobalShortcut(hotkeys, 'toggleDevTool', () =>
    // mainWindow.webContents.toggleDevTools()

    webContents.getAllWebContents().forEach((wc) => wc.toggleDevTools())
  );

  // IF ALL SHORTCUTS ENABLED && MAINWINDOW IS VISIBLE CREATE EVERYTHING
  if (allShortcuts && mainWindow.isVisible()) {
    // RECENT CLIPBOARDS
    createGlobalShortcut(hotkeys, 'recentClipboards', (key) =>
      mainWindow.webContents.send(key.event, key.name)
    );

    // STARRED CLIPBOARDS
    createGlobalShortcut(hotkeys, 'starredClipboards', (key) =>
      mainWindow.webContents.send(key.event, key.name)
    );

    // HISTORY
    createGlobalShortcut(hotkeys, 'history', (key) =>
      mainWindow.webContents.send(key.event, key.name)
    );

    // VIEW MORE
    createGlobalShortcut(hotkeys, 'viewMore', (key) =>
      mainWindow.webContents.send(key.event, key.name)
    );

    // SYNC CLIPBOARD HISTORY
    createGlobalShortcut(hotkeys, 'syncClipboardHistory', (key) =>
      mainWindow.webContents.send(key.event, key.name)
    );

    // PREFRENCES
    createGlobalShortcut(hotkeys, 'preferences', (key) => {
      mainWindow.webContents.send(key.event, key.name);
      mainWindow.hide();
    });

    // ABOUT
    createGlobalShortcut(hotkeys, 'about', (key) => {
      mainWindow.webContents.send(key.event, key.name);
      mainWindow.hide();
    });

    // EXIT
    createGlobalShortcut(hotkeys, 'exit', (key) =>
      mainWindow.webContents.send(key.event, key.name)
    );

    // CLIPBOARD SWITCH
    globalShortcut.registerAll(
      ['1', '2', '3', '4', '5', '6', '7', '8', '9'],
      () =>
        mainWindow.webContents.on(
          'before-input-event',
          (_, input) =>
            Number(input.key) > 0 &&
            Number(input.key) < 10 &&
            mainWindow.webContents.send('clipboardSwitch', Number(input.key))
        )
    );
  }
}

const toggleGlobalShortcutState = async (state: boolean) => {
  const window = getWindow('MAIN_WINDOW_ID');

  globalShortcut.unregisterAll();
  window.webContents.removeAllListeners('before-input-event');

  if (state) window.webContents.send('enableHotkey', state);
  await createGlobalShortcuts(state);
};

export default toggleGlobalShortcutState;
