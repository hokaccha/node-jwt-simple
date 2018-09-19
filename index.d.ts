export type TAlgorithm = 'HS256' | 'HS384' | 'HS512' | 'RS256';

export interface IOptions {
  header: any;
}

export function decode(token: string, key: string, noVerify?: boolean, algorithm?: TAlgorithm): any;

export function encode(payload: any, key: string, algorithm?: TAlgorithm, options?: IOptions): string;
