import {APIMetadataHandler, PROPERTIES} from '../../common';

const handler: APIMetadataHandler = (req, res) => {
  return res.status(200).json({
    info: {
      total_map_count: PROPERTIES.length,
      categories: new Set(PROPERTIES.map(({category}) => category)),
    },
  });
};

export default handler;
