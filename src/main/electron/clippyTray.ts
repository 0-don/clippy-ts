import { log } from 'console';
import {
  Tray,
  app,
  BrowserWindow,
  Menu,
  screen,
  NativeImage,
  globalShortcut,
} from 'electron';
import { displayWindowNearTray } from '../utils/util';

const clippyTray = (iconPath: NativeImage, window: BrowserWindow): Tray => {
  const tray = new Tray(iconPath.resize({ width: 16, height: 16 }));
  // const window = getWindow('MAIN_WINDOW_ID');

  if (!window) {
    process.exit();
  }

  if (process.platform === 'win32') {
    window?.setSkipTaskbar(true);
  } else if (process.platform === 'darwin') {
    app.dock.hide();
  }
  window?.setSkipTaskbar(true);
  tray.setToolTip('Clippy');

  tray.on('click', () => {
    log(screen.getCursorScreenPoint(), tray.getBounds());
    displayWindowNearTray(tray, window);
  });

  window.on('blur', () => {
    const mousePos = screen.getCursorScreenPoint();
    const trayBounds = tray.getBounds();
    const mouseOnTrayIcon =
      mousePos.x > trayBounds.x &&
      mousePos.x < trayBounds.x + trayBounds.width &&
      mousePos.y > trayBounds.y &&
      mousePos.y < trayBounds.y + trayBounds.height;

    if (!mouseOnTrayIcon) {
      window.hide();
    }
  });

  tray.on('right-click', () => {
    const menuConfig = Menu.buildFromTemplate([
      {
        label: 'Quit',
        click: () => app.quit(),
      },
    ]);

    tray.popUpContextMenu(menuConfig);
  });

  // Register a 'CommandOrControl+D' shortcut listener.
  globalShortcut.register('CommandOrControl+D', () => {
    displayWindowNearTray(tray, window);
  });

  return tray;
};

export default clippyTray;
