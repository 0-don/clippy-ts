import { app, globalShortcut, ipcMain } from 'electron';
import { getWindow } from '../../utils/constants';
import createGlobalShortcuts from '../globalShortcut';

// EXIT
ipcMain.handle('exit', () => app.quit());

// VERSION
ipcMain.handle('version', async () => app.getVersion());

// DISABLE HOTKEYS
ipcMain.handle('disableHotkeys', async () => {
  globalShortcut.unregisterAll();
  getWindow('MAIN_WINDOW_ID').webContents.removeAllListeners(
    'before-input-event'
  );
  await createGlobalShortcuts(false);
});
