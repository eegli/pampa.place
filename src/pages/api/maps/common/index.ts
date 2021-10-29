import * as MAPS from '@/config/maps';
import { NextApiRequest } from 'next';

export function filterFields(req: NextApiRequest) {
  const fields: string[] = [];
  if (typeof req.query.fields === 'string') {
    fields.push(req.query.fields);
  } else if (req.query.fields?.length) {
    fields.push(...req.query.fields);
  }
  return fields;
}

export function nthQuery<T>(arg: T | T[], index = 0): T {
  return Array.isArray(arg) ? arg[index] : arg;
}

// TODO
export default {
  custom: MAPS.customMaps,
  default: MAPS.defaultMaps,
  maps: MAPS.MAPS,
};
