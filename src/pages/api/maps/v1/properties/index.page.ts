import {MapProperties} from '@/config/types';
import {ApiJSONHandler, PROPERTIES} from '../../common';

const handler: ApiJSONHandler<MapProperties> = (_, res) => {
  return res.status(200).json({
    data: PROPERTIES,
  });
};

export default handler;
