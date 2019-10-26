import { relative } from 'path';
import { ARCHIVE_PATH, FILE_SERVER } from '@src/config';

import javascriptTimeAgo from 'javascript-time-ago';
require('javascript-time-ago/load-all-locales');

const timeAgoObj = new javascriptTimeAgo('ko-KR');

export function timeAgo(date: Date) {
  return timeAgoObj.format(date);
}

export function dateToString(date: Date) {
  const year = leadingZeros(date.getFullYear(), 4);
  const month = leadingZeros(date.getMonth() + 1, 2);
  const d = leadingZeros(date.getDate(), 2);
  const hour = leadingZeros(date.getHours(), 2);
  const minute = leadingZeros(date.getMinutes(), 2);
  const second = leadingZeros(date.getSeconds(), 2);

  return `${year}-${month}-${d} ${hour}:${minute}:${second}`;
}

export function second2String(second: number) {
  const sec = second % 60;
  const min = (Math.floor(second / 60)) % 60;
  const hour = (Math.floor(second / 3600)) % 60;

  const results: string[] = [];

  if (hour) {
    results.push(`${hour}시간`);
  }

  if (min) {
    results.push(`${min}분`);
  }

  if (!hour && sec) {
    results.push(`${sec}초`);
  }

  return results.join(' ');
}

export function width2Resolution(width: number) {
  const list = {
    1920: '1080p',
    1280: '720p',
    854: '480p',
    640: '360p',
  };

  let diff = 10000;
  let key = 0;
  Object.keys(list).forEach((n) => {
    const d = Math.abs(parseInt(n, 10) - width);
    if (d < diff) {
      diff = d;
      key = parseInt(n, 10);
    }
  });

  return list[key];
}

function leadingZeros(num: number, digits: number) {
  let zero = '';
  const n = num.toString();
  if (n.length < digits) {
    for (let i = 0; i < digits - n.length; i += 1) {
      zero += '0';
    }
  }
  return zero + n;
}

export function pathToURL(path: string): string {
  const uri = path.startsWith(ARCHIVE_PATH)
    ? `/${relative(ARCHIVE_PATH, path)}`
    : path;

  return FILE_SERVER + uri;
}
