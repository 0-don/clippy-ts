/*  eslint global-require: off,
    no-console: off */

import path from 'path';

import 'core-js/stable';
import 'regenerator-runtime/runtime';
import { app, BrowserWindow, ipcMain, Tray, nativeImage } from 'electron';
import { autoUpdater } from 'electron-updater';
import clipboard from 'electron-clipboard-extended';
import log from 'electron-log';
import createWindow from './window';
import './electron/events';
import clippyTray from './electron/clippyTray';

// fs.writeFileSync('./sd/asdyx/test.txt', 'asdsda');

export default class AppUpdater {
  constructor() {
    log.transports.file.level = 'info';
    autoUpdater.logger = log;
    autoUpdater.checkForUpdatesAndNotify();
  }
}

let tray: Tray | null = null;
let mainWindow: BrowserWindow | null = null;
let aboutWindow: BrowserWindow | null = null;
let settingsWindow: BrowserWindow | null = null;

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

const isDevelopment =
  process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';

process.env.APPIMAGE = path.join(
  __dirname,
  'dist',
  `Installar_Mapeo_${app.getVersion()}_linux.AppImage`
);

if (isDevelopment) {
  require('electron-debug')();
}

const RESOURCES_PATH = app.isPackaged
  ? path.join(process.resourcesPath, 'assets')
  : path.join(__dirname, '../../assets');

const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ['REACT_DEVELOPER_TOOLS'];

  return installer
    .default(
      extensions.map((name) => installer[name]),
      forceDownload
    )
    .catch(console.log);
};

const createMainWindow = async () => {
  if (isDevelopment) {
    await installExtensions();
  }

  mainWindow = createWindow('MAIN_WINDOW_ID');

  const img = nativeImage.createFromPath(
    path.resolve(RESOURCES_PATH, 'onclip.png')
  );

  // new Notification({
  //   title: path.resolve(RESOURCES_PATH, 'icon.png'),
  //   body: path.resolve(RESOURCES_PATH, 'icon.png'),
  // }).show();

  tray = clippyTray(img, mainWindow);
  tray.on('click', () => {});

  // Remove this if your app does not use auto updates
  // eslint-disable-next-line
  new AppUpdater();
};

ipcMain.handle('createAboutWindow', () => {
  aboutWindow = createWindow('ABOUT_WINDOW_ID', 'about');
  aboutWindow.on('close', () => {
    aboutWindow = null;
  });
});

ipcMain.handle('createSettingsWindow', () => {
  settingsWindow = createWindow('SETTINGS_WINDOW_ID', 'settings');
  settingsWindow.on('close', () => {
    settingsWindow = null;
  });
});
/**
 * Add event listeners...
 */

app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed

  if (process.platform !== 'darwin') {
    app.quit();
  }
  clipboard.off('text-changed');
  // clipboardListener.stopListening();
});

app
  .whenReady()
  .then(async () => {
    createMainWindow();
    // console.log(
    //   await dialog.showOpenDialog({
    //     properties: ['openFile', 'multiSelections'],
    //   })
    // );
    app.on('activate', () => {
      // On macOS it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      if (mainWindow === null) createMainWindow();
    });
    // Remove this if your app does not use auto updates
    // eslint-disable-next-line
    new AppUpdater();
    return null;
  })
  .catch(console.log);
