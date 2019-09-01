import * as cp from 'child_process';

export function spawn(cmd: string, args: string[]): Promise<string> {
  return new Promise((resolve, reject) => {
    const process = cp.spawn(cmd, args);
    let result = '';
    
    process.stdout.on('data', (data) => {
      result += data.toString();
    });
  
    process.stderr.on('data', (data) => {
      result += data.toString();
    });
  
    process.on('close', () => {
      resolve(result);
    });
  });
}

export function exec(command: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const child = cp.exec(command, (error, stdout, stderr) => {
      if(stderr) {
        reject(stderr.trim());
      } else {
        resolve(stdout.trim());
      }
    });
  })
}