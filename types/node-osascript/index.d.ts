declare module 'node-osascript' {
  namespace osascript {
    interface OsascriptApi {
      execute(
        script: string,
        vars?: Record<string, string>,
        callback?: (err: any, result: any, raw: any) => void,
      ): void
      executeFile(
        file: string,
        vars?: Record<string, string>,
        callback?: (err: any, result: any, raw: any) => void,
      ): void;
    }
  }
  const osascript: osascript.OsascriptApi;
  export = osascript;
}
