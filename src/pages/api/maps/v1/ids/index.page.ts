import {apiData} from '@/config/maps';
import {MapIdCollection} from '@/config/types';
import {ApiJSONHandler, nthQuery} from '../../utils';

const handler: ApiJSONHandler<MapIdCollection> = (req, res) => {
  const typeQuery = nthQuery(req.query.type);

  if (typeQuery) {
    return res.status(200).json({
      data: apiData.MAP_IDS.filter(id => id.category === typeQuery),
    });
  }

  return res.status(200).json({
    data: apiData.MAP_IDS,
  });
};

export default handler;
