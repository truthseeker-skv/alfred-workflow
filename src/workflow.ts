import Conf, { Options } from 'conf';
import osascript from 'node-osascript';

import { cacheConf } from './cache';
import * as env from './env';
import { closeIcon } from './icons';
import { IAction, IItem } from './items/item';
import { createItem } from './items';
import { formatError } from './logger';
import { getFromEnv, prepareVariablesForEnv } from './variables';

export type Workflow = ReturnType<typeof getWorkflow>;

export function getWorkflow<Conf, Cache>(params: WorkflowOptions<Conf, Cache> = {}) {
  const input = process.argv[2] || '';
  const config = initConfig(params.configOptions);
  const cache = initCache(params.cacheOptions);
  const { action, ...variables } = getFromEnv();

  function pushAction<T>(action: IAction<T>) {
    sendResult([], {
      rerunInterval: 0.1,
      variables: { ...variables, action },
    });
  }

  function sendResult(
    items?: IItem<unknown> | Array<IItem<unknown>>,
    params: ISendFeedbackParams = {}
  ) {
    const result = prepareVariablesForEnv({
      items: Array.isArray(items)
        ? items
        : [items].filter(Boolean),
      variables: {
        ...variables,
        ...(params.variables || {})
      },
      rerun: params.rerunInterval,
    });

    console.log(
      JSON.stringify(result, null, 2)
    );
  }

  function sendError(err: Error) {
    const formattedError = formatError(err);

    sendResult([
      createItem({
        title: `${err.name}: ${err.message}`,
        subtitle: 'Press ⌘L to see the full error and ⌘C to copy it.',
        valid: false,
        text: {
          copy: formattedError,
          largetype: err.stack,
        },
        icon: {
          path: closeIcon(),
        },
      })
    ]);
  }

  return {
    env,
    input,
    config,
    cache,
    action: action || { name: null },
    variables: variables || {},
    sendResult,
    pushAction,
    sendError,
    runExternal,
    runOsascript: osascript.execute,
    runOsascriptFile: osascript.executeFile,
  };
}

export interface IRunExternalParams {
  trigger: string;
  applicationId?: string;
  workflowBundleId?: string;
  argument?: string;
}

function runExternal({
  applicationId = 'com.runningwithcrayons.Alfred',
  workflowBundleId = env.wfBundleId(),
  trigger,
  argument = 'test',
}: IRunExternalParams) {
  osascript.execute(
    `tell application id "${applicationId}" to run trigger "${trigger}" in workflow "${workflowBundleId}" with argument "${argument}"`
  );
}

export type ConfigOptions<T> = Omit<Options<T>, 'cwd' | 'serialize'>;

function initConfig<T>(params: ConfigOptions<T> = {}) {
  return new Conf<T>({
    cwd: env.dataPath(),
    serialize: (value) => JSON.stringify(value, null, 2),
    ...params,
  });
}

function initCache<T>(params: ConfigOptions<T> = {}) {
  return cacheConf<T>({
    configName: 'cache',
    cwd: env.cachePath(),
    version: env.version(),
    ...params,
  });
}

export interface WorkflowOptions<Conf, Cache> {
  configOptions?: ConfigOptions<Conf>;
  cacheOptions?: ConfigOptions<Cache>;
}

interface ISendFeedbackParams {
  variables?: Record<string, unknown>;
  rerunInterval?: number;
}
