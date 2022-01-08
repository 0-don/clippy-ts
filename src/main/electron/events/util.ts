import { app, ipcMain } from 'electron';

// EXIT
ipcMain.handle('exit', () => app.quit());

// VERSION
ipcMain.handle('version', async () => app.getVersion());
