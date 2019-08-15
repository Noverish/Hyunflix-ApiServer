import * as parser from 'sami-parser';
import * as iconv from 'iconv-lite';
import * as fs from 'fs';
import * as detectEncoding from 'detect-character-encoding';

export function srt2vtt(path: string) {
  const data = fs.readFileSync(path).toString();
  // remove dos newlines
  let srt = data.replace(/\r+/g, '');
  // trim white space start and end
  srt = srt.replace(/^\s+|\s+$/g, '');
  // get cues
  const cuelist = srt.split('\n\n');
  let result = '';
  if (cuelist.length > 0) {
    result += 'WEBVTT\n\n';
    for (let i = 0; i < cuelist.length; i = i + 1) {
      result += convertSrtCue(cuelist[i]);
    }
  }
  return result;
}

function convertSrtCue(caption) {
  // remove all html tags for security reasons
  // srt = srt.replace(/<[a-zA-Z\/][^>]*>/g, '');
  let cue = '';
  const s = caption.split(/\n/);
  // concatenate muilt-line string separated in array into one
  while (s.length > 3) {
    for (let i = 3; i < s.length; i += 1) {
      s[2] += '\n' + s[i];
    }
    s.splice(3, s.length - 3);
  }
  let line = 0;
  // detect identifier
  if (!s[0].match(/\d+:\d+:\d+/) && s[1].match(/\d+:\d+:\d+/)) {
    cue += s[0].match(/\w+/) + '\n';
    line += 1;
  }
  // get time strings
  if (s[line].match(/\d+:\d+:\d+/)) {
    // convert time string
    const m = s[1].match(/(\d+):(\d+):(\d+)(?:,(\d+))?\s*--?>\s*(\d+):(\d+):(\d+)(?:,(\d+))?/);
    if (m) {
      cue += m[1] + ':' + m[2] + ':' + m[3] + '.' + m[4] + ' --> '
           + m[5] + ':' + m[6] + ':' + m[7] + '.' + m[8] + '\n';
      line += 1;
    } else {
      // Unrecognized timestring
      return '';
    }
  } else {
    // file format error or comment lines
    return '';
  }
  // get cue text
  if (s[line]) {
    cue += s[line] + '\n\n';
  }
  return cue;
}

export function smi2vtt(path: string): string {
  const fileBuffer = fs.readFileSync(path);
  const encoding = detectEncoding(fileBuffer).encoding;

  let content = '';
  if (encoding === 'EUC-KR') {
    content = iconv.decode(fileBuffer, 'euc-kr');
  } else {
    content = fileBuffer.toString();
  }
  const parsed = parser.parse(content);

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
    } else if (content.hasOwnProperty('en')) {
      korean = content['en'];
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
