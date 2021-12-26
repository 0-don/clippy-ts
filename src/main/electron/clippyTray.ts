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
  } else {
    app.dock.hide();
  }

  tray.setToolTip('Clippy');

  tray.on('click', (_, bounds) => {
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
  const ret = globalShortcut.register('CommandOrControl+D', () => {
    displayWindowNearTray(tray, window);
  });

  // if (!ret) {
  //   console.log('registration failed');
  // }

  // // Check whether a shortcut is registered.
  // console.log(globalShortcut.isRegistered('CommandOrControl+D'));

  return tray;
};

export default clippyTray;

// class ClippyTray extends Tray {
//   window: BrowserWindow;

//   constructor(
//     iconPath: string | Electron.NativeImage,
//     window: BrowserWindow
//   ) {
//     super(iconPath);

//     window = window;
//     console.log(getBounds());
//     setToolTip('Clippy');
//     on('click', onClick.bind(this));
//     on('right-click', onRightClick.bind(this));
//   }

//   onClick(event: any, bounds: { x: number; y: number }) {
//     const { x, y } = bounds;

//     const { height, width } = window.getBounds();
//     console.log(x, y, height, width);
//     if (window.isVisible()) {
//       window.hide();
//     } else {
//       const yPosition = process.platform === 'darwin' ? y : y - height;
//       window.setBounds({
//         x: x - width / 2,
//         y: yPosition,
//         height,
//         width,
//       });
//       window.show();
//     }
//   }

//   onRightClick() {
//     const menuConfig = Menu.buildFromTemplate([
//       {
//         label: 'Quit',
//         click: () => app.quit(),
//       },
//     ]);

//     popUpContextMenu(menuConfig);
//   }
// }

// export default ClippyTray;
