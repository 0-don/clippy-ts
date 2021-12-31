import {
  Tray,
  app,
  Menu,
  screen,
  globalShortcut,
  BrowserWindow,
  nativeImage,
} from 'electron';
import path from 'path';
import { getWindow, RESOURCES_PATH } from '../utils/constants';
import { displayWindowNearTray } from '../utils/util';

const createTray = (): Tray => {
  const img = nativeImage.createFromPath(
    path.resolve(RESOURCES_PATH, 'onclip.png')
  );
  const tray = new Tray(img.resize({ width: 16, height: 16 }));
  const window = getWindow('MAIN_WINDOW_ID') as BrowserWindow;

  tray.setToolTip('Clippy');
  if (process.platform === 'darwin') {
    app.dock.hide();
  } else {
    window?.setSkipTaskbar(true);
  }

  tray.on('click', () => displayWindowNearTray(tray, window));

  tray.on('right-click', () => {
    const menuConfig = Menu.buildFromTemplate([
      { label: 'Quit', click: () => app.quit() },
    ]);

    tray.popUpContextMenu(menuConfig);
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

  // Register a 'CommandOrControl+D' shortcut listener.
  // globalShortcut.register('CommandOrControl+D', () => {
  //   displayWindowNearTray(tray, window);
  // });

  return tray;
};

export default createTray;
