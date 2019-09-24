export const presets = {
  pass1: [
    '-c:v', 'libx264',
    '-b:v', '2000k',
    '-pass', '1',
    '-vf', 'scale=1280:-2',
    '-map_chapters', '-1',
    '-f', 'mp4',
    '-an', '-y',
  ].join(' '),
  
  pass2: [
    '-c:v', 'libx264',
    '-b:v', '2000k',
    '-pass', '2',
    '-vf', 'scale=1280:-2',
    '-c:a', 'aac',
    '-b:a', '128k',
    '-ac', '2',
    '-map_chapters', '-1',
    '-y',
  ].join(' '),
  
  mkv2mp4: [
    '-c:v', 'copy',
    '-c:a', 'aac',
    '-b:a', '128k',
    '-ac', '2',
    '-map_chapters', '-1',
    '-y',
  ].join(' '),
  
  maxrate: [
    '-c:v', 'libx264',
    '-b:v', '2000k',
    '-maxrate', '2000k',
    '-bufsize', '4000k',
    '-vf', 'scale=1280:-2',
    '-c:a', 'aac',
    '-b:a', '128k',
    '-ac', '2',
    '-map_chapters', '-1',
    '-y',
  ].join(' '),
}
