/* eslint-disable global-require */
import path from 'path';
import fs from 'fs';
import { error, log } from 'console';
import { app } from 'electron';
import process from 'process';
import { DATABASE_URL, DEFAULT_DATABASE_URL, isDevelopment } from './constants';
import runPrismaCommand from './runPrismaCommand';

if (!isDevelopment) {
  try {
    // Change the directory
    process.chdir(path.dirname(app.getPath('exe')));
    log('directory has successfully been changed');
  } catch (err) {
    // Printing error if occurs
    error('error while changing directory');
  }
}

(async () => {
  if (!fs.existsSync(DATABASE_URL)) {
    fs.copyFileSync(DEFAULT_DATABASE_URL, DATABASE_URL);
  }
  await runPrismaCommand({ command: ['migrate', 'deploy'] });
})();
