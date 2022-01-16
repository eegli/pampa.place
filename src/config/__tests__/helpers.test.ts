import {validateAndComputeGeoJSON} from '../helpers/validator';
import {testFeatureCollecton, testMap} from '../__fixtures__/';

describe('Config generation helpers', () => {
  it('works with features', () => {
    expect(() => validateAndComputeGeoJSON(testMap, 'test')).not.toThrow();
  });
  it('rejects featurecollections', () => {
    expect(() =>
      // @ts-expect-error test input
      validateAndComputeGeoJSON(testFeatureCollecton, 'test')
    ).toThrow();
  });
});
