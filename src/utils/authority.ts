import { Auth } from '@src/models';

export function filterWithAuthority<T>(auth: Auth, list: T[]): T[] {
  const authorityList: string[] = auth.authority;

  if (authorityList.includes('admin')) {
    return list;
  }

  return list.filter((item: T) => {
    const authority: string[] = item['authority'].split(',');

    if (authority.length === 0) {
      return true;
    }

    return authority.every(a => authorityList.includes(a));
  });
}
