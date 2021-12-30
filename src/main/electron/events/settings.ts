import { ipcMain } from 'electron';
import { PrismaClient } from '../../prisma/client/index';
import { prismaClientConfig } from '../../utils/constants';

const prisma = new PrismaClient(prismaClientConfig());

// GET SETTINGS
ipcMain.handle('getSettings', async () =>
  prisma.settings.findFirst({ where: { id: 1 } })
);
