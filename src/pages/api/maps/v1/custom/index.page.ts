import { NextApiRequest, NextApiResponse } from 'next';
import maps from '../../common';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  return res
    .status(200)
    .json(Object.values(maps.customMaps).map(el => el.geo.properties));
}
