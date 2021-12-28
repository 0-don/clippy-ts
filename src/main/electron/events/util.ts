import { log } from 'console';
import { app, ipcMain } from 'electron';

// PING
ipcMain.on('ping', async (event, arg) => {
  const msgTemplate = (pingPong: string) => `IPC test: ${pingPong}`;
  log(msgTemplate(arg));
  event.reply('ping', msgTemplate('pong'));
});

// EXIT
ipcMain.handle('exit', () => app.quit());

// VERSION
ipcMain.handle('version', async () => app.getVersion());
