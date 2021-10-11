import { NextApiRequest, NextApiResponse } from 'next';
import { custom, filterFields } from '../../common';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const filters = filterFields(req);
  if (filters.includes('ids')) {
    return res.status(200).json(Object.keys(custom));
  }

  return res.status(200).json(custom);
}
