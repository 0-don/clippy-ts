import { log } from 'console';
import { HotkeyEvent, prismaClientConfig } from '../utils/constants';
import { PrismaClient, Prisma } from './client/index';
import { GlobalShortcutKeysType } from '../../renderer/utils/contants';

const prisma = new PrismaClient(prismaClientConfig());

const settingsData: Prisma.SettingsCreateInput = {
  id: 1,
  darkmode: false,
  notification: false,
  startup: false,
  synchronize: false,
};

const hotkeyData: Prisma.HotkeyCreateInput[] &
  { event: HotkeyEvent; key: GlobalShortcutKeysType }[] = [
  {
    id: 1,
    event: 'windowDisplayToggle',
    ctrl: true,
    key: 'D',
  },
];

async function seed() {
  log(`Start seeding ...`);

  await prisma.settings.upsert({
    where: { id: settingsData.id },
    create: settingsData,
    update: settingsData,
  });

  await Promise.all(
    hotkeyData.map((key) =>
      prisma.hotkey
        .upsert({
          where: { id: key.id },
          create: key,
          update: { event: key.event },
        })
        .then((data) => data)
    )
  );
}

export default seed;
