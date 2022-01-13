import {MapProperties} from '@/config/types';
import {ApiJSONHandler, data} from '../../common';

const handler: ApiJSONHandler<MapProperties> = (_, res) => {
  return res.status(200).json({
    data: data.properties,
  });
};

export default handler;
