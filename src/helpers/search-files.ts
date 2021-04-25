import mdfind, { Attributes } from 'mdfind';

export {
  Attributes,
};

export interface ISearchFilesParams {
  query: string;
  directories: Array<string>;
  attributes?: Array<Attributes>;
  limit?: number;
  sortResult?: (result: SearchFilesResult) => SearchFilesResult;
}

export const DEFAULT_ATTRIBUTES: Array<Attributes> = [
  'kMDItemDisplayName',
  'kMDItemTextContent',
  'kMDItemFSCreationDate',
  'kMDItemLastUsedDate',
  'kMDItemFSContentChangeDate',
];

export type SearchFilesResult = Array<Record<Attributes, string>>;

export async function searchFiles({
  query,
  directories,
  attributes = DEFAULT_ATTRIBUTES,
  limit = 50,
  sortResult,
}: ISearchFilesParams): Promise<SearchFilesResult> {
  return new Promise((resolve, reject) => {
    let result: SearchFilesResult = [];

    const _query = `(kMDItemDisplayName == '*${query}*'cd) || (kMDItemTextContent == '${query}'cd)`;

    const res = mdfind({
      query: _query,
      attributes,
      limit,
      directories,
    });

    res.output.on('error', reject);
    res.output.on('data', (data) => {
      result = result.concat(data);
    });
    res.output.on('end', () => {
      resolve(
        sortResult
          ? sortResult(result)
          : result
      );
    });
  });
}
