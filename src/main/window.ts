import { app, BrowserWindow, nativeTheme, shell } from 'electron';
import path from 'path';
import MenuBuilder from './electron/menu';
import { resolveHtmlPath } from './utils/util';

const createWindow = (
  env: 'MAIN_WINDOW_ID' | 'ABOUT_WINDOW_ID',
  urlPath: 'about' | undefined = undefined
) => {
  const RESOURCES_PATH = app.isPackaged
    ? path.join(process.resourcesPath, 'assets')
    : path.join(__dirname, '../../assets');

  const getAssetPath = (...paths: string[]): string => {
    return path.join(RESOURCES_PATH, ...paths);
  };

  const widthHeight = app.isPackaged
    ? {
        height: 600,
        width: 375,
      }
    : {
        height: 820,
        width: 728,
      };

  let window: null | BrowserWindow = new BrowserWindow({
    ...widthHeight,
    show: false,
    // frame: false,
    backgroundColor: nativeTheme.shouldUseDarkColors ? '#1c1c1c' : '#ffffff',
    icon: getAssetPath('icon.png'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  process.env[env] = `${window.id}`;

  // mainWindow.loadURL(resolveHtmlPath('index.html#/settings'));
  window.loadURL(resolveHtmlPath(`index.html${urlPath ? `#${urlPath}` : ''}`));

  window.on('ready-to-show', () => {
    if (!window) {
      throw new Error('"mainWindow" is not defined');
    }
    if (process.env.START_MINIMIZED) {
      window.minimize();
    } else {
      window.show();
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
