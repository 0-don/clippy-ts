import { Tray, app, BrowserWindow, Menu, screen } from 'electron';
import { getWindow } from '../utils/constants';

const clippyTray = (iconPath: string): Tray => {
  const tray = new Tray(iconPath);
  const window = getWindow('MAIN_WINDOW_ID') as BrowserWindow;

  if (process.platform === 'win32') {
    window?.setSkipTaskbar(true);
  } else {
    app.dock.hide();
  }

  tray.setToolTip('Clippy');

  tray.on('click', (_, bounds) => {
    const { x, y } = bounds;
    const { height, width } = window.getBounds();

    if (window.isVisible()) {
      window.hide();
    } else {
      const yPosition = process.platform === 'darwin' ? y : y - height;
      window.setBounds({
        x: x - width / 2,
        y: yPosition,
        height,
        width,
      });
      window.show();
    }
  });

  window.on('blur', () => {
    const mousePos = screen.getCursorScreenPoint();
    const bounds = tray.getBounds();
    const onElement =
      mousePos.x > bounds.x &&
      mousePos.x < bounds.x + bounds.width &&
      mousePos.y > bounds.y &&
      mousePos.y < bounds.y + bounds.height;

    if (!onElement) {
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
