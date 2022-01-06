import { app, globalShortcut, ipcMain } from 'electron';
import createGlobalShortcuts from '../globalShortcut';

// EXIT
ipcMain.handle('exit', () => app.quit());

// VERSION
ipcMain.handle('version', async () => app.getVersion());

// DISABLE HOTKEYS
ipcMain.handle('disableHotkeys', async () => {
  globalShortcut.unregisterAll();

  await createGlobalShortcuts(false);
});
