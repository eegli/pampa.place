import { NextApiRequest, NextApiResponse } from 'next';
import { countries, nthQuery } from '../../common';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log(req.query);
  const queryId = nthQuery(req.query.id);
  const mapId = Object.keys(countries).find(
    key => key.toLowerCase() === queryId.toLowerCase()
  );
  if (mapId) {
    return res.status(200).json(countries[mapId]);
  }
  return res.status(404).json({
    error: `Map with id "${queryId}"" not found.`,
  });
}
