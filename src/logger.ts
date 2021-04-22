import cleanStack from 'clean-stack';

import { wfName, wfVersion, version } from './env';

function log(...args: Array<unknown>) {
  console.warn(...args);
}

function error(err: Error) {
  console.error(formatError(err));
}

export function formatError(err: Error) {
  return `
\`\`\`
  ${cleanStack(err.stack || 'No stack', { pretty: true })}
\`\`\`
-
Workflow: ${wfName()} (v. ${wfVersion() || '0.0.0'})
Alfred: ${version()}
`.trim();
}

export default {
  log,
  error,
}
