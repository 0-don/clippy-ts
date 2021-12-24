/* eslint import/prefer-default-export: off, import/no-mutable-exports: off */
import { BrowserWindow } from 'electron';

export const getMainWindow = () => {
  const ID = 1 * Number(process.env.MAIN_WINDOW_ID);
  return BrowserWindow.fromId(ID);
};
