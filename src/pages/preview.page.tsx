import {MAPS} from '@/config/maps';
import React, {useEffect, useRef} from 'react';
import {Header} from '../components/header/header';
import {MapService} from '../services/google';
import {PageContentWrapper} from '../styles/containers';

const PreviewPage = () => {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (ref.current) {
      const unmount = MapService.mount(ref.current);
      const geoJSONs = Object.values(MAPS);

      const features = geoJSONs.reduce((acc, curr) => {
        const f = MapService.map.data.addGeoJson(curr.feature);
        acc.push(...f);
        return acc;
      }, [] as google.maps.Data.Feature[]);

      const coverageLayer = new google.maps.StreetViewCoverageLayer();
      coverageLayer.setMap(MapService.map);

      MapService.map.setCenter({lat: 35, lng: 0});
      MapService.map.setZoom(3);

      MapService.map.data.setStyle({
        fillColor: '#e46fb7',
        fillOpacity: 0.1,
        strokeWeight: 0.8,
      });

      return () => {
        coverageLayer.setMap(null);
        features.forEach(feat => {
          MapService.map.data.remove(feat);
        });

        unmount();
      };
    }
  }, []);
  return (
    <PageContentWrapper id="preview-page" height="calc(100% - 48px)">
      <Header />
      <div
        ref={ref}
        style={{
          height: '100%',
          width: '100%',
        }}
      />
    </PageContentWrapper>
  );
};

export default PreviewPage;
