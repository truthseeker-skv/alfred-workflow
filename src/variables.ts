import isObject from 'lodash/isObject';

const ENV_VAR_PREFIX = 'wf_';

export function getFromEnv() {
  return Object.keys(process.env).reduce((acc: Record<string, any>, key: string) => {
    if (key.startsWith(ENV_VAR_PREFIX)) {
      const name = key.replace(ENV_VAR_PREFIX, '');
      acc[name] = JSON.parse(process.env[key] || 'null');
    }
    return acc;
  }, {});
}

export function addEnvPrefix(vars: Record<string, unknown>) {
  return Object.keys(vars).reduce((acc, it) => {
    return {
      ...acc,
      [`${ENV_VAR_PREFIX}${it}`]: JSON.stringify(vars[it]),
    };
  }, {});
}

export function prepareVariablesForEnv(obj: Record<string, any>) {
  Object.keys(obj).forEach((key: string) => {
    if (key === 'variables') {
      obj[key] = addEnvPrefix(obj[key]);
      return;
    }
    if (isObject(obj[key])) {
      prepareVariablesForEnv(obj[key]);
    }
  });
  return obj;
}
