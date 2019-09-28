export function filterWithAuthority<T>(userAuthority: string[], list: T[]): T[] {
  if (userAuthority.includes('admin')) {
    return list;
  }

  return list.filter((item: T) => {
    const authority: string[] = item['authority'].split(',');

    if (authority.length === 0) {
      return true;
    }

    return authority.every(a => userAuthority.includes(a));
  });
}
