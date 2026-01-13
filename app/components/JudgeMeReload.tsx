import {useEffect} from 'react';
import {useLocation} from 'react-router';

export function JudgeMeReload() {
  const location = useLocation();

  useEffect(() => {
    const w = window as any;
    const cacheServer = w?.jdgmCacheServer;

    if (typeof cacheServer?.reloadAllWidgets === 'function') {
      cacheServer.reloadAllWidgets();
      return;
    }

    if (typeof cacheServer?.reloadAll === 'function') {
      cacheServer.reloadAll();
    }
  }, [location.pathname, location.search]);

  return null;
}
