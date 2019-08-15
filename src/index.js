const ffprobe = require('ffprobe'),
      ffprobeStatic = require('ffprobe-static');

const path = '/archive/TV_Programs/신서유기_2/신서유기 제01화. 을왕리, 新 전설의 시작.mp4'

ffprobe(path, { path: ffprobeStatic.path }, function (err, result) {
  console.log(err);
  console.log(result);
})