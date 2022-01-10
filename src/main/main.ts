/* eslint-disable no-console */
/*  eslint global-require: off */
import './prisma/seed';
import 'core-js/stable';
import { app, BrowserWindow, ipcMain } from 'electron';
import clipboard from 'electron-clipboard-extended';
import log from 'electron-log';
import { autoUpdater } from 'electron-updater';
import path from 'path';
import 'regenerator-runtime/runtime';
import './electron/events';
import toggleGlobalShortcutState from './electron/globalShortcut';
import { createTray } from './electron/tray';
import { isDevelopment } from './utils/constants';
import { dbBackupTask, loadSyncDb, saveSyncDb } from './utils/scheduler';
import createWindow from './window';
import { launchAtStartup } from './utils/util';

export default class AppUpdater {
  constructor() {
    log.transports.file.level = 'info';
    autoUpdater.logger = log;
    autoUpdater.checkForUpdatesAndNotify();
  }
}

let mainWindow: BrowserWindow | null = null;
let aboutWindow: BrowserWindow | null = null;
let settingsWindow: BrowserWindow | null = null;

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

process.env.APPIMAGE = path.join(
  __dirname,
  'dist',
  `Installar_Mapeo_${app.getVersion()}_linux.AppImage`
);

if (isDevelopment) {
  require('electron-debug')();
}

// const installExtensions = async () => {
//   const installer = require('electron-devtools-installer');
//   const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
//   const extensions = ['REACT_DEVELOPER_TOOLS'];

//   return installer
//     .default(
//       extensions.map((name) => installer[name]),
//       forceDownload
//     )
//     .catch(console.log);
// };

const createMainWindow = async () => {
  // if (isDevelopment) {
  //   await installExtensions();
  // }
  await loadSyncDb();
  mainWindow = createWindow('MAIN_WINDOW_ID');
  await createTray();
  await toggleGlobalShortcutState(false);
  await dbBackupTask();
};

ipcMain.handle('createAboutWindow', () => {
  aboutWindow = createWindow('ABOUT_WINDOW_ID', 'about');
  aboutWindow.on('close', () => {
    aboutWindow = null;
  });
});

ipcMain.handle('createSettingsWindow', () => {
  settingsWindow = createWindow('SETTINGS_WINDOW_ID', 'settings', {
    height: 500,
    width: 500,
  });
  settingsWindow.on('close', () => {
    settingsWindow = null;
  });
});

/**
 * Add event listeners...
 */

app.on('quit', async () => {
  await saveSyncDb();
});

app.on('window-all-closed', async () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed

  if (process.platform !== 'darwin') {
    app.quit();
  }
  clipboard.off('text-changed');
});

const gotTheLock = app.requestSingleInstanceLock();

if (!gotTheLock) {
  app.quit();
} else {
  app.on('second-instance', () => {
    // Someone tried to run a second instance, we should focus our window.
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.focus();
    }
  });

  app
    .whenReady()
    .then(async () => {
      await launchAtStartup();
      await createMainWindow();

      app.on('activate', async () => {
        // On macOS it's common to re-create a window in the app when the
        // dock icon is clicked and there are no other windows open.
        if (mainWindow === null) await createMainWindow();
      });
      // Remove this if your app does not use auto updates
      // eslint-disable-next-line
      new AppUpdater();
      return null;
    })
    .catch(console.log);
}
