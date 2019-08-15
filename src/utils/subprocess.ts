import { spawn } from 'child_process';

export function simple(cmd: string, args: string[]): Promise<string> {
  return new Promise((resolve, reject) => {
    const process = spawn(cmd, args);
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