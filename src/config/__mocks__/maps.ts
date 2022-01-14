/* http://localhost:3000/api/maps/mocks */

import {generateMapData} from '../helpers/generator';
import {testMap, testMapId} from '../__fixtures__';

export const testData: ReturnType<typeof generateMapData> = new Map().set(
  testMapId,
  testMap
);
