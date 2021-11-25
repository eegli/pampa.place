import {ApiJSONHandler, data} from '../../utils';

const handler: ApiJSONHandler<string> = (_, res) => {
  return res.status(200).json({
    data: Array.from(new Set(data.MAP_IDS.map(id => id.category))),
  });
};

export default handler;
