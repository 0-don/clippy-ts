/* eslint import/no-mutable-exports: off, no-restricted-properties: off, import/no-cycle: off */
import { BrowserWindow, screen, Tray } from 'electron';
import fs from 'fs';
import path from 'path';
import { URL } from 'url';
import toggleGlobalShortcutState from '../electron/globalShortcut';
import { PrismaClient } from '../prisma/client';
import {
  DEFAULT_DB_CONFIG_PATH,
  ExtendedHotKey,
  prismaClientConfig,
} from './constants';

const prisma = new PrismaClient(prismaClientConfig());

export let resolveHtmlPath: (htmlFileName: string) => string;

if (process.env.NODE_ENV === 'development') {
  const port = process.env.PORT || 1212;
  resolveHtmlPath = (htmlFileName: string) => {
    const url = new URL(`http://localhost:${port}`);
    url.pathname = htmlFileName;
    return decodeURIComponent(url.href);
  };
} else {
  resolveHtmlPath = (htmlFileName: string) => {
    return `file://${path.resolve(__dirname, '../renderer/', htmlFileName)}`;
  };
}

export function formatBytes(bytes: number, decimals = 2) {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

export async function displayWindowNearTray(tray: Tray, window: BrowserWindow) {
  const { x, y } = tray.getBounds();
  const { height, width } = window.getBounds();
  const mousePos = screen.getCursorScreenPoint();

  if (window.isVisible()) {
    window.hide();
  } else {
    const yPositionTray = process.platform === 'darwin' ? y : y - height;
    const yPositionMouse =
      process.platform !== 'darwin' ? mousePos.y : mousePos.y - height;

    window.setBounds({
      x: x ? Math.floor(x - width / 2) : Math.floor(mousePos.x - width / 2),
      y: y ? Math.floor(yPositionTray + 8) : Math.floor(yPositionMouse + 8),
      height,
      width,
    });

    window.show();
    await toggleGlobalShortcutState(true);
  }
}

export async function localStorageHistory() {
  const currentPath = fs.readFileSync(DEFAULT_DB_CONFIG_PATH, 'utf-8');
  const { size } = fs.statSync(currentPath);
  const count = await prisma.clipboard.count();

  return `${count} local items (${formatBytes(
    size
  )}) are saved on this computer`;
}

export function hotkeyToAccelerator(hotkey: ExtendedHotKey) {
  const accelerator: string[] = [];
  if (hotkey.alt) accelerator.push('Alt');
  if (hotkey.ctrl) accelerator.push('CmdOrCtrl');
  if (hotkey.shift) accelerator.push('Shift');
  if (hotkey.key) accelerator.push(hotkey.key);

  const result = accelerator.join('+');

  return result;
}
