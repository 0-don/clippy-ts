/* eslint-disable consistent-return */
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
  on(channel, func) {
    const validChannels = ['addClipboard'];
    if (validChannels.includes(channel)) {
      // Deliberately strip event as it includes `sender`
      const subscription = (event, ...args) => func(...args);
      ipcRenderer.on(channel, subscription);
      return () => {
        ipcRenderer.removeListener(channel, subscription);
      };
    }
  },
  once(channel, func) {
    const validChannels = ['ping'];
    if (validChannels.includes(channel)) {
      // Deliberately strip event as it includes `sender`
      ipcRenderer.once(channel, (event, ...args) => func(...args));
    }
  },
  myPing: () => ipcRenderer.send('ping', 'ping'),
  getClipboards: (arg) => ipcRenderer.invoke('getClipboards', arg),
  deleteClipboard: (arg) => ipcRenderer.invoke('deleteClipboard', arg),
  starClipboard: (arg) => ipcRenderer.invoke('starClipboard', arg),
  switchClipboard: (arg) => ipcRenderer.invoke('switchClipboard', arg),
  exit: (arg) => ipcRenderer.invoke('exit', arg),
  createAboutWindow: (arg) => ipcRenderer.invoke('createAboutWindow', arg),
  createSettingsWindow: (arg) =>
    ipcRenderer.invoke('createSettingsWindow', arg),
  version: (arg) => ipcRenderer.invoke('version', arg),
  getDatbasePath: (arg) => ipcRenderer.invoke('getDatbasePath', arg),
  selectDatabasePath: (arg) => ipcRenderer.invoke('selectDatabasePath', arg),
});
