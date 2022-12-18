import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';

const validChannels = [
  // HotkeyEvent
  'scrollToTop',

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
] as const;

export type Channel = typeof validChannels[number];

contextBridge.exposeInMainWorld('electron', {
  ipcRenderer: {
    on(channel: Channel, func: (...args: unknown[]) => void) {
      if (validChannels.includes(channel)) {
        // Deliberately strip event as it includes `sender`
        const subscription = (_event: IpcRendererEvent, ...args: unknown[]) =>
          func(...args);
        ipcRenderer.on(channel, subscription);
        return () => {
          ipcRenderer.removeListener(channel, subscription);
        };
      }
      return () => {};
    },
    removeAllListeners: (channel: Channel) =>
      validChannels.includes(channel) &&
      ipcRenderer.removeAllListeners(channel),
    page: process.argv
      .find((arg) => arg.includes('PAGE='))
      ?.replace('PAGE=', ''),
    // UTIL
    exit: (arg: unknown) => ipcRenderer.invoke('exit', arg),
    disableHotkeys: (arg: unknown) => ipcRenderer.invoke('disableHotkeys', arg),
    version: (arg: unknown) => ipcRenderer.invoke('version', arg),

    // CLIPBOARD
    getClipboards: (arg: unknown) => ipcRenderer.invoke('getClipboards', arg),
    deleteClipboard: (arg: unknown) =>
      ipcRenderer.invoke('deleteClipboard', arg),
    starClipboard: (arg: unknown) => ipcRenderer.invoke('starClipboard', arg),
    switchClipboard: (arg: unknown) =>
      ipcRenderer.invoke('switchClipboard', arg),

    // WINDOW
    createAboutWindow: (arg: unknown) =>
      ipcRenderer.invoke('createAboutWindow', arg),
    createSettingsWindow: (arg: unknown) =>
      ipcRenderer.invoke('createSettingsWindow', arg),

    // SETTINGS
    getSettings: (arg: unknown) => ipcRenderer.invoke('getSettings', arg),
    updateSettings: (arg: unknown) => ipcRenderer.invoke('updateSettings', arg),
    getHotkey: (arg: unknown) => ipcRenderer.invoke('getHotkey', arg),
    getHotkeys: (arg: unknown) => ipcRenderer.invoke('getHotkeys', arg),
    updateHotkey: (arg: unknown) => ipcRenderer.invoke('updateHotkey', arg),

    // DATABASE
    getDatbasePath: (arg: unknown) => ipcRenderer.invoke('getDatbasePath', arg),
    selectDatabasePath: (arg: unknown) =>
      ipcRenderer.invoke('selectDatabasePath', arg),
    getDatabaseInfo: (arg: unknown) =>
      ipcRenderer.invoke('getDatabaseInfo', arg),
    clearDatabase: (arg: unknown) => ipcRenderer.invoke('clearDatabase', arg),
    toggleSyncClipboardHistory: (arg: unknown) =>
      ipcRenderer.invoke('toggleSyncClipboardHistory', arg),
  },
});
