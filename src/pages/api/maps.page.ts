// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { countryMaps, customMaps, MAPS } from '@/config/maps';
import type { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const fields: string[] = [];

  if (typeof req.query.fields === 'string') {
    fields.push(...req.query.fields.split(','));
  }

  if (req.query.type === 'custom') {
    if (fields.includes('name')) {
      return res.status(200).json(Object.keys(customMaps));
    }
    return res.status(200).json(customMaps);
  }
  if (req.query.type === 'world') {
    if (fields.includes('name')) {
      return res.status(200).json(Object.keys(countryMaps));
    }
    return res.status(200).json(countryMaps);
  }

  if (fields.includes('name')) {
    return res.status(200).json(Object.keys(MAPS));
  }

  return res.status(200).json(MAPS);
}
