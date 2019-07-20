import * as parser from 'sami-parser';
import * as iconv from 'iconv-lite';
import * as fs from 'fs';

export default function (path: string): string {
  const euckr = fs.readFileSync(path);
  const utf8 = iconv.decode(euckr, 'euc-kr');
  const parsed = parser.parse(utf8);

  fs.writeFileSync('/home/hyunsub/result.json', JSON.stringify(parsed, null, 4));

  let result = 'WEBVTT\n\n';

  for (const sentence of parsed['result']) {
    const startTime = sentence['startTime'];
    const endTime = sentence['endTime'];
    const content = sentence['languages'];

    const time = `${convertTimeFormat(startTime)} --> ${convertTimeFormat(endTime)}`;

    if (!content) {
      console.log(sentence);
      continue;
    }

    let korean = null;
    if (content.hasOwnProperty('kr')) {
      korean = content['kr'];
    } else if (content.hasOwnProperty('ko')) {
      korean = content['ko'];
    } else {
      console.log(sentence);
      continue;
    }

    result += `${time}\n${korean}\n\n`;
  }

  return result;
}

function convertTimeFormat(millis: number): string {
  const ms = millis % 1000;
  const s = Math.floor(millis / 1000) % 60;
  const m = Math.floor(millis / 1000 / 60) % 60;
  const h = Math.floor(millis / 1000 / 60 / 60);

  const padms = (`000${ms}`).slice(-3);
  const pads = (`00${s}`).slice(-2);
  const padm = (`00${m}`).slice(-2);
  const padh = (`00${h}`).slice(-2);

  return `${padh}:${padm}:${pads}.${padms}`;
}
