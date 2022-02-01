import {GoogleMapContainer} from '@/components/google/gmap-container';
import {GoogleMapStreetViewCoverageLayer} from '@/components/google/overlay/coverage-layer';
import {CustomHead} from '@/components/head/custom-head';
import {Header} from '@/components/header/header';
import {MapProperties} from '@/config/types';
import {PageContent} from '@/styles/containers';
import {NextPage} from 'next';
import React, {useMemo} from 'react';
import {MAPS} from 'src/maps';
import {config} from '../config/google';

// TODO
export type ClickEvent = {
  latLng: google.maps.LatLng;
  feature: {
    h: MapProperties;
  };
};

export const PreviewPage: NextPage = () => {
  const geojson = useMemo(() => {
    return Array.from(MAPS.values());
  }, []);

  return (
    <>
      <CustomHead title="map preview" />
      <Header />
      <PageContent headerGutter id="preview-page">
        <GoogleMapContainer
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
        </GoogleMapContainer>
      </PageContent>
    </>
  );
};

export default PreviewPage;
