// https://www.alfredapp.com/help/workflows/script-environment-variables/

// Returns the name of the currently running workflow.
export function wfName(): string {
  return getEnv('workflow_name')!;
}

// Returns the version of the currently running workflow.
export function wfVersion(): string {
  return getEnv('workflow_version')!;
}

// Returns the unique ID of the currently running workflow.
// Example: "user.workflow.B0AC54EC-601C-479A-9428-01F9FD732959"
export function wfUid(): string {
  return getEnv('workflow_uid')!;
}

// Returns the bundle ID of the current running workflow.
export function wfBundleId(): string {
  return getEnv('workflow_bundleid')!;
}

// Returns `true` if the user has the debug panel open for the workflow.
export function isDebug(): boolean {
  return getEnv('debug') === '1';
}

// Returns the recommended location for non-volatile workflow data.
// Will only be populated if the workflow has a bundle identifier set.
// Example: "/Users/User/Library/Application Support/Alfred/Workflow Data/com.alfredapp.david.googlesuggest"
export function dataPath() {
  return getEnv('workflow_data');
}

// Returns the recommended location for volatile workflow data.
// Will only be populated if the workflow has a bundle identifier set.
// Example: "/Users/User/Library/Caches/com.runningwithcrayons.Alfred/Workflow Data/com.alfredapp.david.googlesuggest"
export function cachePath() {
  return getEnv('workflow_cache');
}

// Returns the location of the Alfred.alfredpreferences.
// Example: "/Users/Crayons/Alfred/Alfred.alfredpreferences"
export function preferences(): string {
  return getEnv('preferences')!;
}

// Returns the location of local (Mac-specific) preferences.
export function localPreferences(): string {
  return getEnv('preferences_localhash')!;
}

// Returns the version of Alfred.
// Example: "3.2.1"
export function version(): string {
  return getEnv('version')!;
}

// Returns the current Alfred theme.
export function theme(): string {
  return getEnv('theme')!;
}

// Returns the color of the theme background.
// Example: "rgba(255,255,255,0.98)"
export function themeBackground(): string {
  return getEnv('theme_background')!;
}

// Returns the color of the theme's selected item background.
// Example: "rgba(255,255,255,0.98)"
export function themeSelectionBackground(): string {
  return getEnv('theme_selection_background')!;
}

export enum SubtextMode {
  Always = '0',
  AlternativeActions = '1',
  SelectedResult = '2',
  Never = '3',
}

// Returns the subtext mode the user has selected in the Appearance preferences.
export function themeSubtextMode(): SubtextMode {
  switch (getEnv('theme_subtext')) {
    case SubtextMode.Always:
      return SubtextMode.Always;
    case SubtextMode.AlternativeActions:
      return SubtextMode.AlternativeActions;
    case SubtextMode.SelectedResult:
      return SubtextMode.SelectedResult;
    case SubtextMode.Never:
      return SubtextMode.Never;
    default:
      throw new Error('Unknown theme subtext mode received.');
  }
}

function getEnv(key: string) {
  return process.env[`alfred_${key}`];
}
