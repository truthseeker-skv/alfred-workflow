export const checkIcon = () => icon('./png/check.png');
export const closeIcon = () => icon('./png/close.png');
export const settingsIcon = () => icon('./png/setting.png');
export const folderIcon = () => icon('./png/folder.png');
export const fileIcon = () => icon('./png/file.png');
export const questionIcon = () => icon('./png/question.png');
export const alertIcon = () => icon('./png/alert.png');
export const helpIcon = () => icon('./png/help.png');
export const plusIcon = () => icon('./png/plus.png');
export const minusIcon = () => icon('./png/minus.png');
export const reloadIcon = () => icon('./png/reload.png');
export const clockIcon = () => icon('./png/clock.png');

function icon(iconPath: string) {
  return require(`${iconPath}`).default;
}
