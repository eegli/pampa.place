import { NextApiRequest, NextApiResponse } from 'next';
import { computeMapData, computeMapIds } from '../../../../config/helpers';
import { CustomMaps } from '../../../../config/maps';

const mockMapsCustom: CustomMaps = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      properties: { name: 'Custom map' },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [8.530540466308594, 47.35696679330478],
            [8.576202392578125, 47.351384658074124],
            [8.576545715332031, 47.36231578548192],
            [8.568305969238281, 47.38789042338135],
            [8.545989990234375, 47.39904637835624],
            [8.490028381347656, 47.407179440027875],
            [8.472518920898438, 47.39253902496185],
            [8.473548889160156, 47.37277963653446],
            [8.507537841796875, 47.357431944587034],
            [8.530540466308594, 47.35696679330478],
          ],
        ],
      },
    },
  ],
};

const mockMapsDefault: CustomMaps = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      properties: { name: 'Default map' },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [8.530540466308594, 47.35696679330478],
            [8.576202392578125, 47.351384658074124],
            [8.576545715332031, 47.36231578548192],
            [8.568305969238281, 47.38789042338135],
            [8.545989990234375, 47.39904637835624],
            [8.490028381347656, 47.407179440027875],
            [8.472518920898438, 47.39253902496185],
            [8.473548889160156, 47.37277963653446],
            [8.507537841796875, 47.357431944587034],
            [8.530540466308594, 47.35696679330478],
          ],
        ],
      },
    },
  ],
};

const testMapsCustom = computeMapData(mockMapsCustom);
const testMapsDefault = computeMapData(mockMapsDefault);
const testMapIdsCustom = computeMapIds(testMapsCustom);
const testMapIdsDefault = computeMapIds(testMapsDefault);

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  return res.status(200).json({
    ids_custom: testMapIdsCustom,
    ids_default: testMapIdsDefault,
    maps: { ...testMapsCustom, ...testMapsDefault },
  });
}
