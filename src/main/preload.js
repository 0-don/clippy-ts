/* eslint-disable consistent-return */
const { contextBridge, ipcRenderer } = require('electron');

const validChannels = [
  // HotkeyEvent
  'windowDisplayToggle',
  'recentClipboards',
  'starredClipboards',
  'history',
  'viewMore',
  'clipboardSwitch',
  'syncClipboardHistory',
  'preferences',
  'about',
  'exit',

  // OnEvent
  'addClipboard',
  'refreshSettings',
  'refreshHotkeys',
  'enableHotkey',
  'setPage',
];

contextBridge.exposeInMainWorld('electron', {
  on(channel, func) {
    if (validChannels.includes(channel)) {
      // Deliberately strip event as it includes `sender`
      const subscription = (event, ...args) => func(...args);
      ipcRenderer.on(channel, subscription);
      return () => {
        ipcRenderer.removeListener(channel, subscription);
      };
    }
  },
  removeAllListeners: (channel) => {
    if (validChannels.includes(channel)) {
      ipcRenderer.removeAllListeners(channel);
    }
  },
  page: process.argv.find((arg) => arg.includes('PAGE=')).replace('PAGE=', ''),
  // UTIL
  exit: (arg) => ipcRenderer.invoke('exit', arg),
  disableHotkeys: (arg) => ipcRenderer.invoke('disableHotkeys', arg),
  version: (arg) => ipcRenderer.invoke('version', arg),

  // CLIPBOARD
  getClipboards: (arg) => ipcRenderer.invoke('getClipboards', arg),
  deleteClipboard: (arg) => ipcRenderer.invoke('deleteClipboard', arg),
  starClipboard: (arg) => ipcRenderer.invoke('starClipboard', arg),
  switchClipboard: (arg) => ipcRenderer.invoke('switchClipboard', arg),

  // WINDOW
  createAboutWindow: (arg) => ipcRenderer.invoke('createAboutWindow', arg),
  createSettingsWindow: (arg) =>
    ipcRenderer.invoke('createSettingsWindow', arg),

  // SETTINGS
  getSettings: (arg) => ipcRenderer.invoke('getSettings', arg),
  updateSettings: (arg) => ipcRenderer.invoke('updateSettings', arg),
  getHotkey: (arg) => ipcRenderer.invoke('getHotkey', arg),
  getHotkeys: (arg) => ipcRenderer.invoke('getHotkeys', arg),
  updateHotkey: (arg) => ipcRenderer.invoke('updateHotkey', arg),

  // DATABASE
  getDatbasePath: (arg) => ipcRenderer.invoke('getDatbasePath', arg),
  selectDatabasePath: (arg) => ipcRenderer.invoke('selectDatabasePath', arg),
  getDatabaseInfo: (arg) => ipcRenderer.invoke('getDatabaseInfo', arg),
  clearDatabase: (arg) => ipcRenderer.invoke('clearDatabase', arg),
  toggleSyncClipboardHistory: (arg) =>
    ipcRenderer.invoke('toggleSyncClipboardHistory', arg),
});
