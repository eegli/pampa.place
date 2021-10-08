// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { MAPS } from '@/config/maps';
import type { NextApiRequest, NextApiResponse } from 'next';
import { defaultMaps } from '../../config/map-data';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.query.type === 'custom') {
    return res.status(200).json(MAPS);
  }
  if (req.query.type === 'default') {
    return res.status(200).json(defaultMaps);
  }
  return res.status(404).json({ error: 'Resource not found' });
}
