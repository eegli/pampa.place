import {apiData} from '@/config/maps';
import {ApiJSONHandler} from '../../utils';

const handler: ApiJSONHandler<string> = (_, res) => {
  return res.status(200).json({
    data: Array.from(new Set(apiData.MAP_IDS.map(id => id.category))),
  });
};

export default handler;
