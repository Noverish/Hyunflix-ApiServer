import { relative } from 'path';
import { ARCHIVE_PATH, FILE_SERVER } from '@src/config';

import javascriptTimeAgo from 'javascript-time-ago';
require('javascript-time-ago/load-all-locales');

export const timeAgo = new javascriptTimeAgo('ko-KR');

export function dateToString(date: Date) {
  const year = leadingZeros(date.getFullYear(), 4);
  const month = leadingZeros(date.getMonth() + 1, 2);
  const d = leadingZeros(date.getDate(), 2);
  const hour = leadingZeros(date.getHours(), 2);
  const minute = leadingZeros(date.getMinutes(), 2);
  const second = leadingZeros(date.getSeconds(), 2);

  return `${year}-${month}-${d} ${hour}:${minute}:${second}`;
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
