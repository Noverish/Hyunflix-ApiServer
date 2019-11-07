import { Stat } from '@src/models';
import { call } from './';

export function readdir(path: string): Promise<string[]> {
  return call('readdir', { path });
}

export function rename(from: string, to: string): Promise<void> {
  return call('rename', { from, to });
}

export function unlink(path: string): Promise<void> {
  return call('unlink', { path });
}

export function unlinkBulk(paths: string[]): Promise<void> {
  return call('unlinkBulk', { paths });
}

export function stat(path: string): Promise<Stat[]> {
  return call('stat', { path });
}

export function statBulk(paths: string[]): Promise<Stat[]> {
  return call('statBulk', { paths });
}

export function walk(path: string): Promise<string[]> {
  return call('walk', { path });
}
