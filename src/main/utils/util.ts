/* eslint import/no-mutable-exports: off, no-restricted-properties: off */
import { URL } from 'url';
import path from 'path';
import { BrowserWindow, Tray } from 'electron';

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

export function displayWindowNearTray(tray: Tray, window: BrowserWindow) {
  const { x, y } = tray.getBounds();
  const { height, width } = window.getBounds();

  if (window.isVisible()) {
    window.hide();
  } else {
    const yPosition = process.platform === 'darwin' ? y : y - height;
    window.setBounds({
      x: Math.floor(x - width / 2),
      y: Math.floor(yPosition + 8),
      height,
      width,
    });
    window.show();
  }
}