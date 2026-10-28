export type TAlgorithm = 'HS256' | 'HS384' | 'HS512' | 'RS256';

export interface IOptions {
  header: any;
}

export function decode(token: string, key: string | Buffer, noVerify?: boolean, algorithm?: TAlgorithm): any;

export function encode(payload: any, key: string | Buffer, algorithm?: TAlgorithm, options?: IOptions): string;
