declare module 'cache-conf' {
  import Conf, { Options } from 'conf';

  export interface SetDataOptions {
    maxAge: number; // in ms
  }

  export interface GetDataOptions {
    ignoreMaxAge?: boolean;
  }

  class CacheConf extends Conf {
    constructor<T>(options: Options<T> | { version: string });

    get<T>(key: string, options: GetDataOptions): T | undefined;
    set<T>(key: string, val: T, options: SetDataOptions): void;
    has(key: string): boolean;
    isExpired(key: string): boolean;
  }

  namespace CacheConf {}
  export = CacheConf;
}
