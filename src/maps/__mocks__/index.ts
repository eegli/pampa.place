/* http://localhost:3000/api/maps/mocks */

import {testMap} from '@/tests/fixtures/map';
import {generateMapData} from '../helpers/generator';

export const MAPS: ReturnType<typeof generateMapData> = new Map().set(
  testMap.properties.id,
  testMap
);
