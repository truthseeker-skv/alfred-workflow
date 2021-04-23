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
      config.delete(key);
      return null;
    }

    const item = config.get(key) as unknown as ICachedData<T>;

    return item ? item.data : null;
  }

  function set(key: string, value: T[keyof T], options: ISetConfDataOptions) {
    config.set(key, {
      timestamp: Date.now() + options.maxAge,
      version: '',
      data: value,
    });
  }

  function has(key: keyof T) {
    if (!config.has(key)) {
      return false;
    }

    if (isExpired(key)) {
      config.delete(key);
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

  return {
    get,
    set,
    has,
    isExpired,
  };
}
