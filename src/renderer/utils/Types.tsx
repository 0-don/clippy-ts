import { Clipboard } from '../../main/prisma/client/index';
import { GetClipboards } from '../../main/events';

declare global {
  interface Window {
    electron: {
      once: (type: string, arg: unknown) => () => void;
      on: (type: string, arg: unknown) => () => void;
      myPing: () => void;
      doAction: (arg: number[]) => string;
      getClipboards: (arg: GetClipboards) => Promise<Clipboard[]>;
      deleteClipboard: (arg: number) => Promise<boolean>;
      starClipboard: (arg: number) => Promise<boolean>;
      switchClipboard: (arg: Clipboard) => Promise<boolean>;
      exit: () => Promise<boolean>;
    };
  }
}

export default global;
