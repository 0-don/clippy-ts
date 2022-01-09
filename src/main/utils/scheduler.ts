/* eslint-disable no-empty */
/* eslint-disable promise/always-return */
import { log } from 'console';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { Notification } from 'electron';
import fs from 'fs';
import { ToadScheduler, SimpleIntervalJob, AsyncTask } from 'toad-scheduler';
import { Prisma, PrismaClient } from '../prisma/client';
import {
  DEFAULT_DB_CONFIG_PATH,
  DEFAULT_DB_PATH,
  prismaClientConfig,
} from './constants';
import { localStorageHistory } from './util';

dayjs.extend(customParseFormat);

const prisma = new PrismaClient(prismaClientConfig());
const jobId = 'backupJob';

const scheduler = new ToadScheduler();

const asyncDbBackupTask = async () => {
  const { notification } = (await prisma.settings.findFirst({
    where: { id: 1 },
  })) as Prisma.SettingsCreateInput;

  const backupLocation = fs.readFileSync(DEFAULT_DB_CONFIG_PATH, 'utf-8');

  await prisma.$disconnect();
  if (notification) {
    new Notification({
      title: 'Clippy Backup',
      body: `${await localStorageHistory()} and got backed up.`,
    }).show();
  }

  fs.copyFileSync(DEFAULT_DB_PATH, backupLocation);

  log('Sync Backup', dayjs().format('H:mm:ss'));
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
    const task = new AsyncTask('backupTask', asyncDbBackupTask, (err) =>
      log(err)
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
  const { synchronize } = (await prisma.settings.findFirst({
    where: { id: 1 },
  })) as Prisma.SettingsCreateInput;

  if (synchronize && fs.existsSync(DEFAULT_DB_CONFIG_PATH)) {
    const dbLocation = fs.readFileSync(DEFAULT_DB_CONFIG_PATH, 'utf-8');
    const dbExists = fs.existsSync(dbLocation);
    if (dbExists) {
      await prisma.$disconnect();
      fs.copyFileSync(dbLocation, DEFAULT_DB_PATH);
    }
    return true;
  }
  if (synchronize && !fs.existsSync(DEFAULT_DB_CONFIG_PATH)) {
    await prisma.settings.update({
      where: { id: 1 },
      data: { synchronize: false },
    });
  }
  return false;
};

export const saveSyncDb = async () => {
  const { synchronize } = (await prisma.settings.findFirst({
    where: { id: 1 },
  })) as Prisma.SettingsCreateInput;

  if (synchronize && fs.existsSync(DEFAULT_DB_CONFIG_PATH)) {
    const dbLocation = fs.readFileSync(DEFAULT_DB_CONFIG_PATH, 'utf-8');
    await prisma.$disconnect();
    fs.copyFileSync(DEFAULT_DB_PATH, dbLocation);
  }
};
