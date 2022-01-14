/* eslint-disable @typescript-eslint/no-explicit-any */
import { fork } from 'child_process';
import { log } from 'console';
import path from 'path';

const platformToExecutables = {
  win32: {
    migrationEngine:
      process.env.NODE_ENV === 'production'
        ? path.join(
            process.resourcesPath,
            '.prisma/client/migration-engine-windows.exe'
          ) // PROD
        : path.join(
            __dirname,
            '../../../node_modules/.prisma/client/win/migration-engine-windows.exe'
          ), // DEV
    queryEngine:
      process.env.NODE_ENV === 'production'
        ? path.join(
            process.resourcesPath,
            '.prisma/client/query_engine-windows.dll.node'
          ) // PROD
        : path.join(
            __dirname,
            '../../../node_modules/.prisma/client/win/query_engine-windows.dll.node'
          ), // DEV
  },
  linux: {
    migrationEngine:
      process.env.NODE_ENV === 'production'
        ? path.join(
            process.resourcesPath,
            '.prisma/client/migration-engine-debian-openssl-1.1.x'
          ) // PROD
        : path.join(
            __dirname,
            '../../../node_modules/.prisma/client/linux/migration-engine-debian-openssl-1.1.x'
          ), // DEV
    queryEngine:
      process.env.NODE_ENV === 'production'
        ? path.join(
            process.resourcesPath,
            '.prisma/client/libquery_engine-debian-openssl-1.1.x.so.node'
          ) // PROD
        : path.join(
            __dirname,
            '../../../node_modules/.prisma/client/linux/libquery_engine-debian-openssl-1.1.x.so.node'
          ), // DEV
  },
  darwin: {
    migrationEngine:
      process.env.NODE_ENV === 'production'
        ? path.join(
            process.resourcesPath,
            '.prisma/client/migration-engine-darwin'
          ) // PROD
        : path.join(
            __dirname,
            '../../../node_modules/.prisma/client/mac/migration-engine-darwin'
          ), // DEV
    queryEngine:
      process.env.NODE_ENV === 'production'
        ? path.join(
            process.resourcesPath,
            '.prisma/client/libquery_engine-darwin.dylib.node'
          ) // PROD
        : path.join(
            __dirname,
            '../../../node_modules/.prisma/client/mac/libquery_engine-darwin.dylib.node'
          ), // DEV
  },
} as any;

async function runPrismaCommand({
  command,
  dbUrl,
}: {
  command: string[];
  dbUrl: string;
}): Promise<number> {
  try {
    const exitCode = await new Promise((resolve) => {
      const prismaPath =
        process.env.NODE_ENV === 'production'
          ? path.join(process.resourcesPath, '.prisma/client/build/index.js') // PROD
          : path.join(__dirname, '../../../node_modules/prisma/build/index.js'); // DEV;

      log(prismaPath);
      const child = fork(prismaPath, command, {
        env: {
          ...process.env,
          DATABASE_URL: dbUrl,
          PRISMA_MIGRATION_ENGINE_BINARY:
            platformToExecutables[process.platform].migrationEngine,
          PRISMA_QUERY_ENGINE_LIBRARY:
            platformToExecutables[process.platform].queryEngine,
        },
        cwd: 'src/main/prisma/',
        stdio: 'inherit',
      });

      child.on('error', (err) => {
        log('Child process got error:', err);
      });

      child.on('close', (code) => {
        resolve(code);
      });
    });

    if (exitCode !== 0)
      throw Error(`command ${command} failed with exit code ${exitCode}`);

    return exitCode;
  } catch (e) {
    log(e);
    throw e;
  }
}

const DEFAULT_DB_PATH =
  process.env.NODE_ENV === 'production'
    ? path.join(process.resourcesPath, '.prisma/client/clippy.db') // PROD
    : path.join(__dirname, '../prisma/clippy.db'); //

(async () => {
  await runPrismaCommand({
    command: ['prisma migrate deploy'],
    dbUrl: `file:${DEFAULT_DB_PATH}`,
  });
})();

export default runPrismaCommand;
