declare module 'cache-conf' {
  import Conf, { Options } from 'conf';

  class CacheConf extends Conf {
    constructor<T>(options: Options<T> | { version: string });

    get<T>(key: string, options: any): T | undefined;
    set<T>(key: string, val: T, options: any): void;
    has(key: string): boolean;
    isExpired(key: string): boolean;
  }

  namespace CacheConf {}
  export = CacheConf;
}