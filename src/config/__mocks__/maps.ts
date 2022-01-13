/* http://localhost:3000/api/maps/mocks */

import {strict as assert} from 'assert';
import {generateMapData} from '../helpers/generator';
import {testMap, testMapId, testMapProperties} from '../__fixtures__';

const testData: ReturnType<typeof generateMapData> = {
  PROPERTIES: [testMapProperties],
  MAPS: new Map().set(testMapId, testMap),
};

assert(
  testData.MAPS.get(testMapId)?.properties.id === testData.PROPERTIES[0].id
);

export const {MAPS, PROPERTIES} = testData;
