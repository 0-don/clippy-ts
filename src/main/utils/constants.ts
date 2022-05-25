/* eslint-disable import/no-mutable-exports */
/* eslint import/prefer-default-export: off */
import { Hotkey } from '@prisma/client';
import { app, BrowserWindow } from 'electron';
import path from 'path';
import {
  GlobalShortcutKeysType,
  SidebarIconName,
  ViewMoreName,
} from '../../renderer/utils/contants';

export type ENV = 'MAIN_WINDOW_ID' | 'ABOUT_WINDOW_ID' | 'SETTINGS_WINDOW_ID';

export const hotKeyEvents = [
  // local
  'windowDisplayToggle',
  'toggleDevTool',

  // external
  'scrollToTop',

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
  name:
    | SidebarIconName
    | 'Clippy Display Toggle'
    | ViewMoreName
    | 'Toggle Dev Tools';
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

// images and stuff
export const RESOURCES_PATH =
  process.env.NODE_ENV === 'production'
    ? path.join(process.resourcesPath, 'assets') // PROD
    : path.join(__dirname, '../../../assets'); // DEV

// Database in userData folder saved from uninstall
export const DATABASE_URL =
  process.env.NODE_ENV === 'production'
    ? path.join(app.getPath('userData'), 'clippy.db')
    : path.join(__dirname, '../prisma/clippy.db');

// Database in the app folder
export const DEFAULT_DATABASE_URL =
  process.env.NODE_ENV === 'production'
    ? path.join(process.resourcesPath, '.prisma/client/clippy.db') // PROD
    : path.join(__dirname, '../prisma/clippy.db'); // DEV

// Sync Clipboard History Database Location file
export const DEFAULT_DB_CONFIG_PATH =
  process.env.NODE_ENV === 'production'
    ? path.join(app.getPath('userData'), 'db.config') // PROD
    : path.join(__dirname, '../prisma/db.config'); // DEV

export const DEFAULT_PRISMA_SCHEMA =
  process.env.NODE_ENV === 'production'
    ? path.join(process.resourcesPath, '.prisma/client/schema.prisma') // PROD
    : path.join(__dirname, '../prisma/schema.prisma'); // DEV

export const DEFAULT_PRISMA_CLI =
  process.env.NODE_ENV === 'production'
    ? path.join(process.resourcesPath, '.prisma/client/build/index.js') // PROD
    : path.join(__dirname, '../../../node_modules/prisma/build/index.js'); // DEV;

export const prismaClientConfig = {
  datasources: { db: { url: `file:${DATABASE_URL}` } },
};
