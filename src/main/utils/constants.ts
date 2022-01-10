/* eslint-disable import/no-mutable-exports */
/* eslint import/prefer-default-export: off */
import { app, BrowserWindow, Tray } from 'electron';
import path from 'path';
import { Hotkey } from '../prisma/client';
import {
  GlobalShortcutKeysType,
  SidebarIconName,
  ViewMoreName,
} from '../../renderer/utils/contants';

export let tray: Tray;

export type ENV = 'MAIN_WINDOW_ID' | 'ABOUT_WINDOW_ID' | 'SETTINGS_WINDOW_ID';

export const hotKeyEvents = [
  // local
  'windowDisplayToggle',

  // external
  'recentClipboards',
  'starredClipboards',
  'history',
  'viewMore',
  'clipboardSwitch',
  'syncClipboardHistory',
  'preferences',
  'about',
  'exit',
] as const;
export type HotkeyEvent = typeof hotKeyEvents[number];

export const onEvents = [
  'addClipboard',
  'refreshSettings',
  'refreshHotkeys',
  'enableHotkey',
  ...hotKeyEvents,
] as const;
export type OnEvent = typeof onEvents[number];

export interface ExtendedHotKey extends Hotkey {
  event: HotkeyEvent;
  key: GlobalShortcutKeysType;
  name: SidebarIconName | 'Clippy Display Toggle' | ViewMoreName;
}

export type GetClipboards = {
  cursor?: number;
  star?: boolean;
  search?: string;
  showImages?: boolean;
};

export const getWindow = (env: ENV) => {
  const ID = 1 * Number(process.env[env]);
  return BrowserWindow.fromId(ID) as BrowserWindow;
};

export const isDevelopment =
  process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';

export const RESOURCES_PATH = app.isPackaged
  ? path.join(process.resourcesPath, 'assets')
  : path.join(__dirname, '../../../assets');

export const DEFAULT_DB_PATH = app.isPackaged
  ? path.join(process.resourcesPath, 'src/main/prisma/db/clippy.db')
  : path.join(__dirname, '../prisma/db/clippy.db');

export const DEFAULT_DB_CONFIG_PATH = app.isPackaged
  ? path.join(process.resourcesPath, 'src/main/prisma/db/db.config')
  : path.join(__dirname, '../prisma/db/db.config');

export const DEFAULT_DB_DIRECTORY = app.isPackaged
  ? path.join(process.resourcesPath, 'src/main/prisma/db/')
  : path.join(__dirname, '../prisma/db/');
