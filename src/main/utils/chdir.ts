/* eslint-disable global-require */
import { error, log } from 'console';
import { app } from 'electron';
import process from 'process';
import { isDevelopment } from './constants';

if (!isDevelopment) {
  try {
    // Change the directory
    process.chdir(require('path').dirname(app.getPath('exe')));
    log('directory has successfully been changed');
  } catch (err) {
    // Printing error if occurs
    error('error while changing directory');
  }
}
