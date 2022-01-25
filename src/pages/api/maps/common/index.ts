import {MapProperties} from '@/config/types';
import {MAPS} from '@/maps/index';
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

type MetaRespone<T> = {
  info: T;
};

export type ApiJSONHandler<T = unknown> = NextApiHandler<
  DataResponse<T> | ErrorResponse
>;

export type APIMetadataHandler<T = unknown> = NextApiHandler<
  MetaRespone<T> | ErrorResponse
>;

export type ApiTextHandler = NextApiHandler<string> | ErrorResponse;

export function nthQuery<T>(arg: T | T[], index = 0): T | undefined {
  return Array.isArray(arg) ? arg[index] : arg;
}

export const PROPERTIES: MapProperties[] = Array.from(MAPS.values()).map(
  m => m.properties
);

export {MAPS};
