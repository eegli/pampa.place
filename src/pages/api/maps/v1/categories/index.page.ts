import {ApiJSONHandler, MAPS} from '../../common';

const handler: ApiJSONHandler<string> = (_, res) => {
  const categories = MAPS.info.map(m => m.category);
  return res.status(200).json({
    data: Array.from(new Set(categories)),
  });
};

export default handler;
