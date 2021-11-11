import {NextApiRequest, NextApiResponse} from 'next';
import {data, nthQuery} from '../../common';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const nameQuery = nthQuery(req.query.name);
  const idQuery = nthQuery(req.query.id);

  if (nameQuery) {
    const map = Object.values(data.MAPS).find(
      map =>
        map.feature.properties.name.toLowerCase() === nameQuery.toLowerCase()
    );

    if (map) {
      return res.status(200).json({
        data: map,
      });
    }
    return res.status(404).json({error: `Map with name ${nameQuery} found`});
  }

  if (idQuery) {
    const map = data.MAPS[idQuery];

    if (map) {
      return res.status(200).json({
        data: map,
      });
    }
    return res.status(404).json({error: `Map with id ${nameQuery} found`});
  }

  return res.status(200).json({
    data: data.MAPS,
  });
}
