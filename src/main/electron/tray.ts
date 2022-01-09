/* eslint-disable import/no-mutable-exports */
/* eslint-disable import/no-cycle */
import { Tray, app, Menu, screen, BrowserWindow, nativeImage } from 'electron';
import path from 'path';
import { getWindow, RESOURCES_PATH } from '../utils/constants';
import { displayWindowNearTray } from '../utils/util';
import toggleGlobalShortcutState from './globalShortcut';

export let tray: Tray;

export const createTray = () => {
  const window = getWindow('MAIN_WINDOW_ID') as BrowserWindow;
  tray = new Tray(
    nativeImage
      .createFromPath(path.resolve(RESOURCES_PATH, 'onclip.png'))
      .resize({ width: 16, height: 16 })
  );

  tray.setToolTip('Clippy');
  if (process.platform === 'darwin') {
    app.dock.hide();
  } else {
    window?.setSkipTaskbar(true);
  }

  tray.on('click', async () => displayWindowNearTray(tray, window));

  tray.on('right-click', () => {
    const menuConfig = Menu.buildFromTemplate([
      { label: 'Quit', click: () => app.quit() },
    ]);

    tray.popUpContextMenu(menuConfig);
  });

  window.on('blur', async () => {
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
    await toggleGlobalShortcutState(false);
  });

  return tray as unknown as Promise<Tray>;
};
