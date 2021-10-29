import { NextApiRequest, NextApiResponse } from 'next';
import maps, { nthQuery } from '../../common';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const queryId = nthQuery(req.query.id);
  const map = Object.values(maps.custom).find(
    key => key.geo.properties.name.toLowerCase() === queryId.toLowerCase()
  );
  if (map) {
    return res.status(200).json(map);
  }
  return res.status(404).json({
    error: `Map with id "${queryId}"" not found.`,
  });
}
