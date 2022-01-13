import {MapData} from '@/config/types';
import {ApiJSONHandler, data, nthQuery} from '../../common';

const handler: ApiJSONHandler<MapData> = (req, res) => {
  const idQuery = nthQuery(req.query.id);

  if (idQuery) {
    const map = data.geojson.get(idQuery);

    if (map) {
      return res.status(200).json({
        data: [map],
      });
    }
    return res.status(404).json({error: `Map with id ${idQuery} found`});
  }

  return res.status(200).json({
    data: Array.from(data.geojson.values()),
  });
};

export default handler;
