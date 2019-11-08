import { Auth } from '@src/models';

export function filterWithAuthority<T>(auth: Auth, list: T[]): T[] {
  const authorityList: string[] = auth.authority;

  if (authorityList.includes('admin')) {
    return list;
  }

  return list.filter((item: T) => {
    if (!item['authority']) {
      return true;
    }

    const authority: string[] = item['authority'].split(',').filter(v => !!v);
    return authority.every(a => authorityList.includes(a));
  });
}
