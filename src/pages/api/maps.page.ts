// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { countryMaps, customMaps, MAPS } from '@/config/maps';
import type { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const fields: string[] = [];

  if (typeof req.query.fields === 'string') {
    fields.push(...req.query.fields.split(','));
  }

  function isStr(T: string | string[]): T is string {
    return typeof req.query.id === 'string';
  }

  if (req.query.type === 'custom') {
    if (fields.includes('name')) {
      return res.status(200).json(Object.keys(customMaps));
    }
    if (isStr(req.query.id)) {
      return res.status(200).json(customMaps[req.query.id]);
    }
    return res.status(200).json(customMaps);
  }
  if (req.query.type === 'country') {
    if (fields.includes('name')) {
      return res.status(200).json(Object.keys(countryMaps));
    }
    if (isStr(req.query.id)) {
      return res.status(200).json(countryMaps[req.query.id]);
    }
    return res.status(200).json(countryMaps);
  }

  if (fields.includes('name')) {
    return res.status(200).json(Object.keys(MAPS));
  }

  if (isStr(req.query.id)) {
    return res.status(200).json(MAPS[req.query.id]);
  }

  return res.status(200).json(MAPS);
}
