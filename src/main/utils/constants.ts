/* eslint import/prefer-default-export: off, import/no-mutable-exports: off */
import { BrowserWindow } from 'electron';

export type ENV = 'MAIN_WINDOW_ID' | 'ABOUT_WINDOW_ID' | 'SETTINGS_WINDOW_ID';

export const getWindow = (env: ENV) => {
  const ID = 1 * Number(process.env[env]);
  return BrowserWindow.fromId(ID);
};
