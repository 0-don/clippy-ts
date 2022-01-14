/* eslint-disable @typescript-eslint/no-explicit-any */
import { fork } from 'child_process';
import { log } from 'console';
import path from 'path';
import {
  DEFAULT_PRISMA_CLI,
  DEFAULT_PRISMA_SCHEMA,
  DATABASE_URL,
} from './constants';

const dest = (os: 'win' | 'linux' | 'darwin') =>
  process.env.NODE_ENV === 'production'
    ? path.join(process.resourcesPath, '.prisma/client/')
    : path.join(__dirname, `../../../node_modules/.prisma/client/${os}/`);

const platformToExecutables = {
  win32: {
    migrationEngine: path.join(dest('win'), 'migration-engine-windows.exe'),
    queryEngine: path.join(dest('win'), 'query_engine-windows.dll.node'),
  },
  linux: {
    migrationEngine: path.join(
      dest('linux'),
      'migration-engine-debian-openssl-1.1.x'
    ),
    queryEngine: path.join(
      dest('linux'),
      'libquery_engine-debian-openssl-1.1.x.so.node'
    ),
  },
  darwin: {
    migrationEngine: path.join(dest('darwin'), 'migration-engine-darwin'),
    queryEngine: path.join(dest('darwin'), 'libquery_engine-darwin.dylib.node'),
  },
} as any;

async function runPrismaCommand({
  command,
}: {
  command: string[];
}): Promise<number> {
  try {
    const exitCode = await new Promise((resolve) => {
      const child = fork(
        DEFAULT_PRISMA_CLI,
        [...command, '--schema', DEFAULT_PRISMA_SCHEMA],
        {
          env: {
            ...process.env,
            DATABASE_URL: `file:${DATABASE_URL}`,
            PRISMA_MIGRATION_ENGINE_BINARY:
              platformToExecutables[process.platform].migrationEngine,
            PRISMA_QUERY_ENGINE_LIBRARY:
              platformToExecutables[process.platform].queryEngine,
          },
          stdio: 'inherit',
        }
      );

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

// (async () => {
//   await runPrismaCommand({ command: ['migrate', 'deploy'] });
// })();

export default runPrismaCommand;
