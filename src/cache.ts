import Conf, { Options } from 'conf';

export interface ICacheOptions<T> extends Options<T> {
  version: string;
}

export interface IGetConfDataOptions {
  ignoreMaxAge?: boolean;
}

export interface ISetConfDataOptions {
  maxAge: number; // ms
}

export interface ICachedData<T> {
  timestamp: number;
  version: string;
  data: T[keyof T];
}

export function cacheConf<T>(options?: ICacheOptions<T>) {
  const config = new Conf<T>(options);

  function get(key: keyof T, options?: IGetConfDataOptions): T[keyof T] | null {
    if (!options?.ignoreMaxAge && isExpired(key)) {
      del(key);
      return null;
    }

    const item = config.get(key) as unknown as ICachedData<T>;

    return item ? item.data : null;
  }

  function set(key: string, value: T[keyof T], opts: ISetConfDataOptions) {
    config.set(key, {
      timestamp: Date.now() + opts.maxAge,
      version: options?.version,
      data: value,
    });
  }

  function has(key: keyof T) {
    if (!config.has(key)) {
      return false;
    }

    if (isExpired(key)) {
      del(key);
      return false;
    }

    return true;
  }

  function isExpired(key: keyof T): boolean {
    const item = config.get(key) as unknown as ICachedData<T>;

    if (!item) {
      return false;
    }

    const invalidTimestamp = !item.timestamp || (item.timestamp < Date.now());
    const invalidVersion = item.version !== options?.version;

    return invalidTimestamp || invalidVersion;
  }

  function del(key: keyof T): void {
    config.delete(key);
  }

  function clear(): void {
    config.clear();
  }

  function reset(key: keyof T): void {
    config.reset(key);
  }

  return {
    get,
    set,
    has,
    isExpired,
    delete: del,
    clear,
    reset,
  };
}
