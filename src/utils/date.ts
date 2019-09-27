import * as moment from 'moment-timezone';

export function dateToString(date: Date): string {
  return moment(date).tz('Asia/Seoul').format('YYYY-MM-DD HH:mm:ss');
}
