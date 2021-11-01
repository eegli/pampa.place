import { NextApiRequest, NextApiResponse } from 'next';
import { data } from '../../common';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.query.type) {
    case 'custom':
      return res.status(200).json({
        custom_map_ids: data.CUSTOM_MAP_IDS,
      });
    case 'default':
      return res.status(200).json({
        default_map_ids: data.DEFAULT_MAP_IDS,
      });
    default:
      return res.status(422).json({
        error: `Unknown type "${req.query.type}".`,
      });
  }
}
