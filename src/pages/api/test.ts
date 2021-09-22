// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import * as turf from '@turf/turf';
import type { NextApiRequest, NextApiResponse } from 'next';
import maps from '../../../maps/custom';
import computedMaps from '../../config/maps';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  /*   const poly = turf.polygon([maps.ZH.features[0].geometry.coordinates[0]]); */

  const bb = turf.bbox(maps.ZH);

  const points = turf.randomPoint(3, { bbox: bb });

  const ptsWithin = turf.pointsWithinPolygon(points, maps.ZH);

  /*  const random = turf.randomPoint(1, poly); */

  res.status(200).json({
    computedMaps,
    ptsWithin,
  });
}
