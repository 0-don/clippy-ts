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

const scheduler = new ToadScheduler();

const asyncTask = async () => {
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

export const loadSyncDb = async () => {
  const { synchronize } = (await prisma.settings.findFirst({
    where: { id: 1 },
  })) as Prisma.SettingsCreateInput;

  if (synchronize && fs.existsSync(DEFAULT_DB_CONFIG_PATH)) {
    const dbLocation = fs.readFileSync(DEFAULT_DB_CONFIG_PATH, 'utf-8');
    const dbExists = fs.existsSync(dbLocation);
    // log('Sync Db:', fs.statSync(dbLocation));
    // log('Client Db:', fs.statSync(DEFAULT_DB_PATH));
    if (dbExists) {
      await prisma.$disconnect();
      fs.copyFileSync(dbLocation, DEFAULT_DB_PATH);
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
    fs.copyFileSync(DEFAULT_DB_PATH, dbLocation);
  }
};

export const createTask = async () => {
  const { synchronize, syncTime } = (await prisma.settings.findFirst({
    where: { id: 1 },
  })) as Prisma.SettingsCreateInput;

  if (synchronize && fs.existsSync(DEFAULT_DB_CONFIG_PATH)) {
    const task = new AsyncTask('backupTask', asyncTask, (err) => log(err));
    const job = new SimpleIntervalJob(
      { seconds: syncTime, runImmediately: true },
      task,
      'backupJob'
    );
    scheduler.addSimpleIntervalJob(job);
  }
};

export const deleteTask = async () => {
  const { notification } = (await prisma.settings.findFirst({
    where: { id: 1 },
  })) as Prisma.SettingsCreateInput;

  if (notification) {
    new Notification({
      title: 'Clippy Backup',
      body: `Sync Stopped.`,
    }).show();
  }

  scheduler.removeById('backupJob');
};
