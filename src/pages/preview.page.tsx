import {GoogleMap} from '@/components/google/google-map';
import {CustomHead} from '@/components/head/custom-head';
import {Header} from '@/components/header/header';
import {config} from '@/config/google';
import {PageContent} from '@/styles/containers';
import {NextPage} from 'next';
import {useMemo} from 'react';
import {MAPS} from 'src/maps';
import {GoogleMapStreetViewCoverageLayer} from '../components/google/layers/coverage';

export const PreviewPage: NextPage = () => {
  const geojson = useMemo(() => {
    return Array.from(MAPS.values());
  }, []);
  return (
    <>
      <CustomHead title="map preview" />
      <Header />
      <PageContent headerGutter id="preview-page">
        <GoogleMap
          id="map-preview-all"
          center={{lat: 35, lng: 0}}
          zoom={4}
          onMount={map => {
            geojson.forEach(feat => map.data.addGeoJson(feat));
            map.data.setStyle({
              fillColor: '#e46fb7',
              fillOpacity: 0.1,
              strokeWeight: 0.8,
            });
            map.setOptions(config.map.default);
          }}
          onUnmount={map => {
            map.data.forEach(feature => {
              map.data.remove(feature);
            });
          }}
        >
          <GoogleMapStreetViewCoverageLayer />
        </GoogleMap>
      </PageContent>
    </>
  );
};

export default PreviewPage;
