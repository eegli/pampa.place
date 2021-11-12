import {NextApiRequest, NextApiResponse} from 'next';
import {data} from '../../common';
export default function handler(req: NextApiRequest, res: NextApiResponse) {
  return res.status(200).json({
    data: Array.from(new Set(data.MAP_IDS.map(id => id.category))),
  });
}
