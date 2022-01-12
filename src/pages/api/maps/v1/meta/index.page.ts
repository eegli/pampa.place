import {APIMetadataHandler, MAPS} from '../../common';

const handler: APIMetadataHandler = (req, res) => {
  return res.status(200).json({
    info: {
      total_map_count: MAPS.info.length,
    },
  });
};

export default handler;
