/* 
There are a lot of Google implementations that are used in the thunks that need to be mocked properly, e.g. StreetViewPreference and StreetViewSource (see jest-setup.ts). Make sure they have a correctly defined initial implementation that can later be overwritten individually for each test. 
*/

describe('Google global mock setup', () => {
  it('street view service resolves', async () => {
    const service = new google.maps.StreetViewService();
    expect(service).toBeTruthy();
    expect(await service.getPanorama({})).toMatchSnapshot('default response');

    jest
      .spyOn(google.maps.StreetViewService.prototype, 'getPanorama')
      // @ts-ignore
      .mockImplementation(() => {
        return Promise.resolve({ok: true});
      });
    expect(await service.getPanorama({})).toMatchSnapshot(
      'overwritten response'
    );
  });
  it('enums are defined', () => {
    expect(google.maps.StreetViewPreference).toMatchSnapshot();
    expect(google.maps.StreetViewSource).toMatchSnapshot();
  });
});

export {};
