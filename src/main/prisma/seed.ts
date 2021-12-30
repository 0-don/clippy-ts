import { log } from 'console';
import { prismaClientConfig } from '../utils/constants';
import { PrismaClient, Prisma } from './client/index';

const prisma = new PrismaClient(prismaClientConfig());

const settingsData: Prisma.SettingsCreateInput = {
  darkmode: false,
  notification: false,
  startup: false,
  synchronize: false,
};

async function seed() {
  log(`Start seeding ...`);

  const isSettings = await prisma.settings.count();
  log(isSettings);
  if (!isSettings) {
    await prisma.settings.create({
      data: settingsData,
    });
  }
}

export default seed;
