import {NextApiRequest, NextApiResponse} from 'next';
import {data} from '../../common';
export default function handler(req: NextApiRequest, res: NextApiResponse) {
  return res.status(200).json({
    data: data.MAP_IDS,
  });
}
