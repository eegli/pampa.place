import { NextApiRequest, NextApiResponse } from 'next';
import { data } from '../../common';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  return res.status(200).json({
    custom_map_ids: data.CUSTOM_MAP_IDS,
    default_map_ids: data.DEFAULT_MAP_IDS,
  });
}
