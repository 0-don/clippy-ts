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

const electronHandler = {
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
    exit: () => ipcRenderer.invoke('exit'),
    disableHotkeys: () => ipcRenderer.invoke('disableHotkeys'),
    version: () => ipcRenderer.invoke('version'),

    // CLIPBOARD
    getClipboards: (arg: unknown) => ipcRenderer.invoke('getClipboards', arg),
    deleteClipboard: (arg: unknown) =>
      ipcRenderer.invoke('deleteClipboard', arg),
    starClipboard: (arg: unknown) => ipcRenderer.invoke('starClipboard', arg),
    switchClipboard: (arg: unknown) =>
      ipcRenderer.invoke('switchClipboard', arg),

    // WINDOW
    createAboutWindow: () => ipcRenderer.invoke('createAboutWindow'),
    createSettingsWindow: () => ipcRenderer.invoke('createSettingsWindow'),

    // SETTINGS
    getSettings: () => ipcRenderer.invoke('getSettings'),
    updateSettings: (arg: unknown) => ipcRenderer.invoke('updateSettings', arg),
    getHotkey: (arg: unknown) => ipcRenderer.invoke('getHotkey', arg),
    getHotkeys: () => ipcRenderer.invoke('getHotkeys'),
    updateHotkey: (arg: unknown) => ipcRenderer.invoke('updateHotkey', arg),

    // DATABASE
    getDatbasePath: () => ipcRenderer.invoke('getDatbasePath'),
    selectDatabasePath: (arg: unknown) =>
      ipcRenderer.invoke('selectDatabasePath', arg),
    getDatabaseInfo: () => ipcRenderer.invoke('getDatabaseInfo'),
    clearDatabase: () => ipcRenderer.invoke('clearDatabase'),
    toggleSyncClipboardHistory: () =>
      ipcRenderer.invoke('toggleSyncClipboardHistory'),
  },
};

contextBridge.exposeInMainWorld('electron', electronHandler);

export type ElectronHandler = typeof electronHandler;
