/* eslint import/prefer-default-export: off, import/no-mutable-exports: off */
import { app, BrowserWindow } from 'electron';
import path from 'path';

export type ENV = 'MAIN_WINDOW_ID' | 'ABOUT_WINDOW_ID' | 'SETTINGS_WINDOW_ID';

export const getWindow = (env: ENV) => {
  const ID = 1 * Number(process.env[env]);
  return BrowserWindow.fromId(ID);
};

export const isDevelopment =
  process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';

export const RESOURCES_PATH = app.isPackaged
  ? path.join(process.resourcesPath, 'assets')
  : path.join(__dirname, '../../../assets');
