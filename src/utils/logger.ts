import * as morgan from 'morgan';
import * as fs from 'fs';
import * as path from 'path';
import * as moment from 'moment';
import { Address6, Address4 } from 'ip-address';
const rfs = require('rotating-file-stream');

morgan.token('path', (req, res) => { return decodeURI(req.path); });
morgan.token('remote-addr', (req, res) => {
  const ip = req.ip ||
    req._remoteAddress ||
    (req.connection && req.connection.remoteAddress) ||
    undefined;

  if (ip) {
    const addr6 = new Address6(ip);
    if (addr6.isValid() && addr6.is4()) {
      return addr6.to4().address;
    }
  }

  return ip;
});

function fileName(time: Date | null, index: number): string {
  if (time) {
    return `${moment(time).format('YYYY-MM-DD')}.log`;
  }
  return `${moment().format('YYYY-MM-DD')}.log`;
}

const consoleFormat = '[:date[iso]] :remote-addr - :method :status ":path"';
export const consoleLogger = morgan(consoleFormat);

const logDirectory = path.join(__dirname, '../../logs');
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);
const accessLogStream = rfs(fileName, {
  interval: '1h',
  path: logDirectory,
});

const fileFormat = '[:date[iso]] :remote-addr - :method :status ":path" ":user-agent"';
export const fileLogger = morgan(fileFormat, { stream: accessLogStream });
