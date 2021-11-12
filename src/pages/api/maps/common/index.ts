export {apiData as data} from '@/config/maps';
import {NextApiRequest} from 'next';

export function objToArr<T extends Record<string, any>, P = any>(obj: T): P[] {
  return Object.entries(obj).reduce((acc, [key, val]) => {
    acc.push({id: key, data: val});
    return acc;
  }, [] as any[]);
}

export function queryParamToArr(req: NextApiRequest, queryParam: string) {
  const queries = req.query[queryParam];
  return Array.isArray(queries) ? queries : [queries];
}

export function nthQuery<T>(arg: T | T[], index = 0): T {
  return Array.isArray(arg) ? arg[index] : arg;
}
