import {apiData} from '@/config/maps';
import {MapData} from '@/config/types';
import {ApiJSONHandler, nthQuery} from '../../utils';

const handler: ApiJSONHandler<MapData> = (req, res) => {
  const nameQuery = nthQuery(req.query.name);
  const idQuery = nthQuery(req.query.id);

  if (nameQuery) {
    return res.status(200).json({
      data: Object.values(apiData.MAPS).filter(
        map =>
          map.feature.properties.name.toLowerCase() === nameQuery.toLowerCase()
      ),
    });
  }

  if (idQuery) {
    const map = apiData.MAPS[idQuery];

    if (map) {
      return res.status(200).json({
        data: [map],
      });
    }
    return res.status(404).json({error: `Map with id ${idQuery} found`});
  }

  return res.status(200).json({
    data: Object.values(apiData.MAPS),
  });
};

export default handler;
