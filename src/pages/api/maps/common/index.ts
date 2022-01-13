import {MAPS} from '@/config/maps';
import {NextApiHandler} from 'next';

export const data = {
  properties: Array.from(MAPS, ([, value]) => ({...value.properties})),
  geojson: MAPS,
};

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
