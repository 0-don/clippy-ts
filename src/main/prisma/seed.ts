/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
import { Prisma, PrismaClient } from '@prisma/client';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import dayjs from 'dayjs';
import { log } from 'console';
import path from 'path';

const prisma = new PrismaClient({
  datasources: { db: { url: `file:${path.join(__dirname, '/clippy.db')}` } },
});

const settingsData: Prisma.SettingsCreateInput = {
  id: 1,
  darkmode: true,
  notification: true,
  startup: true,
  synchronize: false,
  syncTime: 600,
};

const keys = [
  {
    id: 1,
    event: 'windowDisplayToggle',
    ctrl: true,
    alt: false,
    shift: false,
    key: 'Y',
    status: true,
    name: 'Clippy Display Toggle',
    icon: JSON.stringify(['far', 'keyboard'] as IconProp),
  },
  {
    id: 2,
    event: 'recentClipboards',
    ctrl: false,
    alt: false,
    shift: false,
    key: 'R',
    status: true,
    name: 'Recent Clipboards',
    icon: JSON.stringify(['fas', 'history'] as IconProp),
  },
  {
    id: 3,
    event: 'starredClipboards',
    ctrl: false,
    alt: false,
    shift: false,
    key: 'S',
    status: true,
    name: 'Starred Clipboards',
    icon: JSON.stringify(['fas', 'star'] as IconProp),
  },
  {
    id: 4,
    event: 'history',
    ctrl: false,
    alt: false,
    shift: false,
    key: 'H',
    status: true,
    name: 'History',
    icon: JSON.stringify(['fas', 'search'] as IconProp),
  },
  {
    id: 5,
    event: 'viewMore',
    ctrl: false,
    alt: false,
    shift: false,
    key: 'M',
    status: true,
    name: 'View more',
    icon: JSON.stringify(['fas', 'ellipsis-h'] as IconProp),
  },
  {
    id: 6,
    event: 'syncClipboardHistory',
    ctrl: false,
    alt: false,
    shift: false,
    key: 'P',
    status: true,
    name: 'Sync Clipboard History',
    icon: JSON.stringify(['far', 'save'] as IconProp),
  },
  {
    id: 7,
    event: 'preferences',
    ctrl: false,
    alt: false,
    shift: false,
    key: 'O',
    status: true,
    name: 'Preferences',
    icon: JSON.stringify(['fas', 'cog'] as IconProp),
  },
  {
    id: 8,
    event: 'about',
    ctrl: false,
    alt: false,
    shift: false,
    key: 'A',
    status: true,
    name: 'About',
    icon: JSON.stringify(['fas', 'info-circle'] as IconProp),
  },
  {
    id: 9,
    event: 'exit',
    ctrl: false,
    alt: false,
    shift: false,
    key: 'X',
    status: true,
    name: 'Exit',
    icon: JSON.stringify(['fas', 'sign-out-alt'] as IconProp),
  },
  {
    id: 10,
    event: 'toggleDevTool',
    ctrl: true,
    alt: false,
    shift: false,
    key: 'F11',
    status: true,
    name: 'Toggle Dev Tools',
    icon: JSON.stringify(['fas', 'tools'] as IconProp),
  },
  {
    id: 11,
    event: 'scrollToTop',
    ctrl: false,
    alt: false,
    shift: false,
    key: 'E',
    status: true,
    name: 'Scroll to Top',
    icon: JSON.stringify(['fas', 'arrow-up'] as IconProp),
  },
];

// async function seed() {
//   log('Start seeding ...', dayjs().format('H:mm:ss'));

//   await prisma.settings.upsert({
//     where: { id: settingsData.id },
//     create: settingsData,
//     update: settingsData,
//   });

//   for (const key of keys) {
//     await prisma.hotkey.upsert({
//       where: { id: key.id },
//       create: key,
//       update: key,
//     });
//   }
// }

async function seed() {
  log('Start seeding ...', dayjs().format('H:mm:ss'));

  const settings = await prisma.settings.findFirst({
    where: { id: settingsData.id },
  });

  if (!settings) {
    await prisma.settings.create({ data: settingsData });
  }

  for (const key of keys) {
    const hotkey = await prisma.hotkey.findFirst({ where: { id: key.id } });
    if (!hotkey) {
      await prisma.hotkey.create({ data: key });
    }
  }
}

(async () => {
  await seed();
  await prisma.$disconnect();
})();
