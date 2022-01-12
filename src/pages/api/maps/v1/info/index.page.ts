import {MapInfoCollection} from '@/config/types';
import {ApiJSONHandler, MAPS, nthQuery} from '../../common';

const handler: ApiJSONHandler<MapInfoCollection> = (req, res) => {
  const categoryQuery = nthQuery(req.query.category);

  if (categoryQuery) {
    return res.status(200).json({
      data: MAPS.info.filter(item => item.category === categoryQuery),
    });
  }

  return res.status(200).json({
    data: MAPS.info,
  });
};

export default handler;
