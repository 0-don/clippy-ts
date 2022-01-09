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

  log(notification);
};

export const createTask = async () => {
  const { synchronize, syncTime } = (await prisma.settings.findFirst({
    where: { id: 1 },
  })) as Prisma.SettingsCreateInput;

  if (synchronize && fs.existsSync(DEFAULT_DB_CONFIG_PATH)) {
    const task = new AsyncTask('backupTask', asyncTask, (err) => log(err));
    const job = new SimpleIntervalJob({ seconds: syncTime }, task, 'backupJob');
    scheduler.addSimpleIntervalJob(job);
  }
};

export const deleteTask = () => scheduler.removeById('backupJob');
