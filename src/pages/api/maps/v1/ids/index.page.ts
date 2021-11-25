import {MapIdCollection} from '@/config/types';
import {ApiJSONHandler, data, nthQuery} from '../../utils';

const handler: ApiJSONHandler<MapIdCollection> = (req, res) => {
  const type = nthQuery(req.query.type);

  if (type) {
    return res.status(200).json({
      data: data.MAP_IDS.filter(id => id.category === type),
    });
  }

  return res.status(200).json({
    data: data.MAP_IDS,
  });
};

export default handler;
