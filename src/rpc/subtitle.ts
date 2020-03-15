import { RawSubtitle } from '@src/models';
import { call } from '.';

export function subtitle(path: string): Promise<RawSubtitle[]> {
  return call('subtitle', { path });
}
