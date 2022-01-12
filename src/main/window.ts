import { app, BrowserWindow, nativeTheme, shell } from 'electron';
import path from 'path';
import MenuBuilder from './electron/menu';
import { ENV, RESOURCES_PATH } from './utils/constants';
import { resolveHtmlPath } from './utils/util';

const devWindowSize = {
  height: 820,
  width: 728,
};

const createWindow = (
  env: ENV,
  urlPath: 'about' | 'settings' | undefined = undefined,
  size: {
    height: number;
    width: number;
  } = {
    height: 600,
    width: 375,
  }
) => {
  const getAssetPath = (...paths: string[]): string => {
    return path.join(RESOURCES_PATH, ...paths);
  };

  const widthHeight = app.isPackaged ? size : devWindowSize;

  let window: null | BrowserWindow = new BrowserWindow({
    ...widthHeight,
    show: false,
    frame: !!urlPath,
    backgroundColor: nativeTheme.shouldUseDarkColors ? '#1c1c1c' : '#ffffff',
    icon: getAssetPath('icon.png'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  process.env[env] = `${window.id}`;

  window.loadURL(
    resolveHtmlPath(`index.html${urlPath ? `/#/${urlPath}` : ''}`)
  );

  window.on('ready-to-show', () => {
    if (!window) {
      throw new Error('"mainWindow" is not defined');
    }
    if (urlPath) {
      if (process.env.START_MINIMIZED) {
        window.minimize();
      } else {
        window.show();
      }
    }
  });

  window.on('closed', () => {
    window = null;
  });

  const menuBuilder = new MenuBuilder(window);
  menuBuilder.buildMenu();

  // Open urls in the user's browser
  window.webContents.on('new-window', (event, url) => {
    event.preventDefault();
    shell.openExternal(url);
  });

  return window;
};

export default createWindow;
