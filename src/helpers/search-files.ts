import mdfind, { Attributes } from 'mdfind';

export interface ISearchFilesParams {
  query: string;
  directories: Array<string>;
  attributes?: Array<Attributes>;
  limit?: number;
  sortResults?: (results: Array<Record<Attributes, string>>) => Array<Record<Attributes, string>>;
}

export const DEFAULT_ATTRIBUTES: Array<Attributes> = [
  'kMDItemDisplayName',
  'kMDItemTextContent',
  'kMDItemFSCreationDate',
  'kMDItemLastUsedDate',
  'kMDItemFSContentChangeDate',
];

export async function searchFiles({
  query,
  directories,
  attributes = DEFAULT_ATTRIBUTES,
  limit = 50,
  sortResults,
}: ISearchFilesParams) {
  return new Promise((resolve, reject) => {
    let result: Array<Record<Attributes, string>> = [];

    const _query = `(kMDItemDisplayName == '*${query}*'cd) || (kMDItemTextContent == '${query}'cd)`;

    const res = mdfind({
      query: _query,
      attributes,
      limit,
      directories,
    });

    res.output.on('data', (data) => {
      result = result.concat(data);
    });
    res.output.on('error', (err) => reject(err));
    res.output.on('end', () => {
      resolve(
        sortResults
          ? sortResults(result)
          : result
      );
    });
  });
}
