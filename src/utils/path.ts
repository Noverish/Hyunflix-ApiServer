export function checkAuthority(token: string, path: string): boolean {
  const paths = [
    '/archive/Movies',
    '/archive/TV_Seires',
    '/archive/torrents',
  ];

  for (const root of paths) {
    if (isChildOf(path, root)) {
      return true;
    }
  }

  return false;
}

const isChildOf = (child, parent) => {
  if (child === parent) return false;
  const parentTokens = parent.split('/').filter(i => i.length);
  return parentTokens.every((t, i) => child.split('/')[i] === t);
};
