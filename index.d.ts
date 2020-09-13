import { KeyLike } from 'crypto';

export type TAlgorithm = 'HS256' | 'HS384' | 'HS512' | 'RS256';

export interface IOptions {
  header: any;
}

export function decode(token: string, key: string | Buffer, noVerify?: boolean, algorithm?: TAlgorithm): any;
export function decode(token: string, key: KeyLike, noVerify: true): any;
export function decode(token: string, key: KeyLike, noVerify: boolean, algorithm: TAlgorithm): any;

export function encode(payload: any, key: KeyLike, algorithm?: TAlgorithm, options?: IOptions): string;
