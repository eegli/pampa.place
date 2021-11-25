export {apiData as data} from '@/config/maps';
import {NextApiHandler} from 'next';

type ErrorResponse = {
  error: string;
};

type DataResponse<T> = T extends unknown[]
  ? {
      data: T;
    }
  : {
      data: T[];
    };

export type ApiJSONHandler<T = unknown> = NextApiHandler<
  DataResponse<T> | ErrorResponse
>;
export type ApiTextHandler = NextApiHandler<string> | ErrorResponse;

export function nthQuery<T>(arg: T | T[], index = 0): T | undefined {
  return Array.isArray(arg) ? arg[index] : arg;
}
