import {APIMetadataHandler, data} from '../../common';

const handler: APIMetadataHandler = (req, res) => {
  const categories = data.properties.map(({category}) => category);
  return res.status(200).json({
    info: {
      total_map_count: data.properties.length,
      categories: Array.from(new Set(categories)),
    },
  });
};

export default handler;
