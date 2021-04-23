import logger from './logger';
import { getWorkflow } from './workflow';
import * as icons from './icons';
import * as macIcons from './icons/mac';
import * as env from './env';

type WorkflowHandler = () => Promise<void>;

export { icons, macIcons, logger, getWorkflow, env };
export * from './items';
export * from './items/item';

export async function run(handler: WorkflowHandler): Promise<void> {
  let exitCode = 0;

  try {
    await handler();
  } catch (err) {
    logger.error(err);
    getWorkflow().sendError(err);

    exitCode = 1;
  } finally {
    process.exit(exitCode);
  }
}
