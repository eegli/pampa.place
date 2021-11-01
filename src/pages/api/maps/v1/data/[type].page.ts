import { NextApiRequest, NextApiResponse } from 'next';
import { data } from '../../common';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log(req.query);

  const typeQuery = req.query.type;
  const nameQuery = req.query.name;

  switch (typeQuery) {
    case 'custom':
      if (typeof nameQuery === 'string') {
        const map = data.CUSTOM_MAP_IDS.find(
          el => el.name.toLowerCase() === nameQuery.toLowerCase()
        );

        if (map) {
          return res.status(200).json(data.customMaps[map.id]);
        }
        return res.status(404).json({
          error: `Map with name "${nameQuery} not found".`,
        });
      }
      return res.status(200).json({
        custom_maps: data.customMaps,
      });
    case 'default':
      if (typeof nameQuery === 'string') {
        const map = data.DEFAULT_MAP_IDS.find(
          el => el.name.toLowerCase() === nameQuery.toLowerCase()
        );

        if (map) {
          return res.status(200).json(data.defaultMaps[map.id]);
        }
        return res.status(404).json({
          error: `Map with name "${nameQuery} not found".`,
        });
      }
      return res.status(200).json({
        default_maps: data.defaultMaps,
      });
    default:
      return res.status(422).json({
        error: `Unknown type "${typeQuery}".`,
      });
  }
}
