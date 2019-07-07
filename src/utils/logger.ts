import * as fs from 'fs';
import * as winston from 'winston';
import * as WinstonRotate from 'winston-daily-rotate-file';

const logDir = 'logs';

if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

const consoleTransport = new winston.transports.Console({
  level: 'info'
})

const fileTransport = new WinstonRotate({
  dirname: 'log',
  filename: '%DATE%.log',
  datePattern: 'YYYY-MM-DD'
});

const logger = winston.createLogger({
  transports: [consoleTransport, fileTransport]
});

export default function (req, res, next) {
  const ip = req.ip;
  const method = req.method;
  const url = req['decodedPath'];
  const userAgent = req.headers['user-agent'];
  
  const payload = { ip, method, url, userAgent };
  
  logger.info(payload);
  
  next();
}