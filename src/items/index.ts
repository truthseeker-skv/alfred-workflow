import { Dirent } from 'fs';
import { EntryInfo } from 'readdirp';
import { questionIcon, closeIcon, folderIcon, fileIcon } from '../icons';
import { IItem, ItemType, IItemOrig } from './item';

export function createItem<T>(_item: IItem<T>): IItemOrig {
  const { action, ...item } = _item;

  return {
    valid: true,
    type: ItemType.Default,

    ...item,
    variables: {
      ...item.variables,
      action,
    },

    modifiers: Object.keys(item.modifiers || {}).reduce((acc, key) => {
      acc[key] = {
        ...acc[key],
        variables: {
          ...acc[key].variables,
          action: acc[key].action,
        },
      };
      return acc;
    }, {}),
  };
}

export function createInfoItem(item: Omit<IItem<null>, 'icon' | 'valid'>) {
  return createItem({
    ...item,
    valid: false,
    icon: {
      path: questionIcon(),
    }
  });
}

export function createDeleteItem<T>(item: Omit<IItem<T>, 'icon'>) {
  return createItem({
    ...item,
    icon: { path: closeIcon() },
  });
}

export function createDirentItem(entry: EntryInfo) {
  return createItem({
    title: entry.path,
    subtitle: entry.fullPath,
    autocomplete: `${entry.fullPath}${entry.dirent?.isDirectory() ? '/' : ''}`,
    valid: false,
    type: ItemType.File,
    icon: {
      path: getDirentItemIcon(entry.dirent),
    },
  })
}

function getDirentItemIcon(dirent?: Dirent) {
  if (dirent?.isDirectory()) {
    return folderIcon();
  }
  if (dirent?.isFile()) {
    return fileIcon();
  }
  return questionIcon();
}
