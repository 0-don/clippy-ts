/* eslint-disable global-require */
import path from 'path';
import { error, log } from 'console';
import { app } from 'electron';
import process from 'process';
import { isDevelopment } from './constants';

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
