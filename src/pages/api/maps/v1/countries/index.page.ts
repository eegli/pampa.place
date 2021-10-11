import { NextApiRequest, NextApiResponse } from 'next';
import { countries } from '../../common';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  return res.status(200).json(Object.keys(countries));
}
