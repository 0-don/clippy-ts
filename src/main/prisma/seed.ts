import { log } from 'console';
import { HotkeyEvent, prismaClientConfig } from '../utils/constants';
import { PrismaClient, Prisma } from './client/index';
import { GlobalShortcutKeysType } from '../../renderer/utils/contants';

const prisma = new PrismaClient(prismaClientConfig());

const settingsData: Prisma.SettingsCreateInput = {
  id: 1,
  darkmode: true,
  notification: false,
  startup: true,
  synchronize: false,
};

const hotkeyData: Prisma.HotkeyCreateInput[] &
  { event: HotkeyEvent; key: GlobalShortcutKeysType }[] = [
  {
    id: 1,
    event: 'windowDisplayToggle',
    shift: false,
    ctrl: true,
    alt: false,
    key: 'D',
    status: true,
    name: 'Clippy Display Toggle',
  },
  {
    id: 2,
    event: 'setTab',
    shift: true,
    ctrl: false,
    alt: false,
    key: 'H',
    status: true,
    name: 'Recent Clipboards',
  },
];

async function seed() {
  log(`Start seeding ...`);

  await prisma.settings.upsert({
    where: { id: settingsData.id },
    create: settingsData,
    update: { id: settingsData.id },
  });

  await Promise.all(
    hotkeyData.map((key) =>
      prisma.hotkey
        .upsert({
          where: { id: key.id },
          create: key,
          update: key,
        })
        .then((data) => data)
    )
  );
}

export default seed;
