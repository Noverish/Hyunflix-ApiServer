import { FILE_SERVER } from '@src/config';

import JavascriptTimeAgo from 'javascript-time-ago';

require('javascript-time-ago/load-all-locales');

const timeAgoObj = new JavascriptTimeAgo('ko-KR');

export function timeAgo(date: Date) {
  return timeAgoObj.format(date);
}

export function dateToString(date: Date) {
  const year = date.getFullYear().toString().padStart(4, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const hour = date.getHours().toString().padStart(2, '0');
  const minute = date.getMinutes().toString().padStart(2, '0');
  const second = date.getSeconds().toString().padStart(2, '0');

  return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
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

export function pathToURL(path: string): string {
  return FILE_SERVER + path;
}

export function authorityCheck(has: number, needed: number) {
  /* eslint-disable */
  return needed === (has & needed);
  /* eslint-enable */
}

export function compactObject(obj: object) {
  const newObj = {};
  Object.keys(obj).forEach((k) => {
    if (obj[k] !== undefined) newObj[k] = obj[k];
  });
  return newObj;
}
