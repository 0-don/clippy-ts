import { log } from 'console';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { Notification } from 'electron';
import fs from 'fs';
import { AsyncTask, SimpleIntervalJob, ToadScheduler } from 'toad-scheduler';
import { Prisma, PrismaClient } from '@prisma/client';
import {
  DEFAULT_DB_CONFIG_PATH,
  DATABASE_URL,
  prismaClientConfig,
} from './constants';

dayjs.extend(customParseFormat);

const prisma = new PrismaClient(prismaClientConfig);
const jobId = 'backupJob';

const scheduler = new ToadScheduler();

const asyncDbBackupTask = async () => {
  return prisma.settings
    .findFirst({
      where: { id: 1 },
    })
    .then((settings) => {
      const backupLocation = fs.readFileSync(DEFAULT_DB_CONFIG_PATH, 'utf-8');

      if (settings?.notification) {
        new Notification({
          title: 'Clippy Backup',
          body: `Backing up...`,
        }).show();
      }
      fs.copyFileSync(DATABASE_URL, backupLocation);
      log('Sync Backup', dayjs().format('H:mm:ss'));

      return null;
    });
};

const removeDbBackupTask = async () => {
  const { notification, synchronize } = (await prisma.settings.findFirst({
    where: { id: 1 },
  })) as Prisma.SettingsCreateInput;

  if (notification && !synchronize && fs.existsSync(DEFAULT_DB_CONFIG_PATH)) {
    log('Sync Stop', dayjs().format('H:mm:ss'));
    new Notification({
      title: 'Clippy Backup',
      body: `Sync Stopped.`,
    }).show();
  }

  scheduler.removeById(jobId);
};

export const dbBackupTask = async () => {
  await removeDbBackupTask();

  const { synchronize, syncTime } = (await prisma.settings.findFirst({
    where: { id: 1 },
  })) as Prisma.SettingsCreateInput;

  if (synchronize && fs.existsSync(DEFAULT_DB_CONFIG_PATH)) {
    const task = new AsyncTask(
      'backupTask',
      asyncDbBackupTask as unknown as () => Promise<void>,
      (err) => log(err)
    );
    const job = new SimpleIntervalJob(
      { seconds: syncTime, runImmediately: true },
      task,
      jobId
    );
    scheduler.addSimpleIntervalJob(job);
  }
};

export const loadSyncDb = async () => {
  if (fs.existsSync(DEFAULT_DB_CONFIG_PATH)) {
    const dbLocation = fs.readFileSync(DEFAULT_DB_CONFIG_PATH, 'utf-8');
    const dbExists = fs.existsSync(dbLocation);
    if (dbExists) {
      await prisma.$disconnect();
      fs.copyFileSync(dbLocation, DATABASE_URL);
    }
  }
};

export const saveSyncDb = async () => {
  const { synchronize } = (await prisma.settings.findFirst({
    where: { id: 1 },
  })) as Prisma.SettingsCreateInput;

  if (synchronize && fs.existsSync(DEFAULT_DB_CONFIG_PATH)) {
    const dbLocation = fs.readFileSync(DEFAULT_DB_CONFIG_PATH, 'utf-8');
    await prisma.$disconnect();
    fs.copyFileSync(DATABASE_URL, dbLocation);
  }
};
