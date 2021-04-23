import Conf, { Options } from 'conf';

import * as env from './env';
import { closeIcon } from './icons';
import { IAction, IItem } from './items/item';
import { createItem } from './items';
import { formatError } from './logger';
import { getFromEnv, prepareVariablesForEnv } from './variables';

export type Workflow = ReturnType<typeof getWorkflow>;

export function getWorkflow<T>(params: WorkflowOptions<T> = {}) {
  const input = process.argv[2] || '';
  const config = initConfig(params.configOptions);
  const { action, ...variables } = getFromEnv();

  function pushAction<T>(action: IAction<T>) {
    sendResult([], {
      rerunInterval: 0.1,
      variables: { ...variables, action },
    });
  }

  function sendResult(
    items?: IItem<T> | Array<IItem<T>>,
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
    action: action || { name: null },
    variables: variables || {},
    sendResult,
    pushAction,
    sendError,
  };
}

export type ConfigOptions<T> = Omit<Options<T>, 'cwd' | 'serialize'>;

function initConfig<T>(params: ConfigOptions<T> = {}) {
  return new Conf({
    cwd: env.dataPath(),
    serialize: (value) => JSON.stringify(value, null, 2),
    ...params,
  });
}

export interface WorkflowOptions<T> {
  configOptions?: ConfigOptions<T>;
}

interface ISendFeedbackParams {
  variables?: Record<string, unknown>;
  rerunInterval?: number;
}
