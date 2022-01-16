/* http://localhost:3000/api/maps/mocks */

import {generateMapData} from '../helpers/generator';
import {testMap} from '../__fixtures__/';

export const MAPS: ReturnType<typeof generateMapData> = new Map().set(
  testMap.properties.id,
  testMap
);
