/* 
There are a lot of Google implementations that are used in the thunks that need to be mocked properly, e.g. StreetViewPreference and StreetViewSource (see jest-setup.ts). Make sure they have a correctly defined initial implementation that can later be overwritten individually for each test. 
*/

describe('Valid mocks', () => {
  it('SVService resolves', async () => {
    const service = new google.maps.StreetViewService();
    expect(service).toBeTruthy();
    expect(await service.getPanorama({})).toEqual({test: true});
  });
});

export {};
