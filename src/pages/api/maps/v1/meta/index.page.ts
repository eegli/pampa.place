import {apiData} from '@/config/maps';
import {APIMetadataHandler} from '../../utils';

const handler: APIMetadataHandler = (req, res) => {
  return res.status(200).json({
    info: {
      total_map_count: apiData.MAP_IDS.length,
    },
  });
};

export default handler;
