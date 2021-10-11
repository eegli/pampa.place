import { NextApiRequest, NextApiResponse } from 'next';
import { custom, nthQuery } from '../../common';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const queryId = nthQuery(req.query.id);
  const mapId = Object.keys(custom).find(
    key => key.toLowerCase() === queryId.toLowerCase()
  );
  if (mapId) {
    return res.status(200).json(custom[mapId]);
  }
  return res.status(404).json({
    error: `Map with id "${queryId}"" not found.`,
  });
}
