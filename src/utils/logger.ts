import * as morgan from 'morgan';
import * as fs from 'fs';
import * as path from 'path';
import * as moment from 'moment-timezone';
const rfs = require('rotating-file-stream');

morgan.token('remote-addr', (req, res) => {
  const ip = req.ip || req._remoteAddress || (req.connection && req.connection.remoteAddress) || undefined;
  if (ip && typeof ip === 'string' && ip.split(':').length === 4) {
    return ip.split(':')[3];
  }

  return ip;
});

morgan.token('date', (req, res) => {
  return moment().tz('Asia/Seoul').format('YYYY-MM-DD HH:mm:ss');
});

morgan.token('user-id', (req, res) => {
  return (req.userId) ? req.userId : undefined;
});

function fileName(time: Date | null, index: number): string {
  if (time) {
    return `${moment(time).format('YYYY-MM-DD')}.log`;
  }

  return `${moment().format('YYYY-MM-DD')}.log`;
}

const consoleFormat = '[:date] <:remote-addr> :user-id - :method :status :response-time ms ":url"';
export const consoleLogger = morgan(consoleFormat);

const logDirectory = path.join(__dirname, '../../logs');
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);
const accessLogStream = rfs(fileName, {
  interval: '1h',
  path: logDirectory,
  immutable: true,
});

const fileFormat = '[:date] <:remote-addr> :user-id - :method :status :response-time ms ":url" ":user-agent"';
export const fileLogger = morgan(fileFormat, {
  stream: accessLogStream,
  skip (req, res) {
    if (req.user_id) {
      return req.user_id === 1 || req.user_id === 4;
    }
    return false;
  },
});
