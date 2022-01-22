import {Header} from '@/components/header/header';
import {config} from '@/config/google';
import {MAPS} from '@/config/maps';
import {MapProperties} from '@/config/types';
import {PageContent} from '@/styles/containers';
import {isInPolygon} from '@/utils/geo';
import {alpha, Checkbox, FormControlLabel, FormGroup} from '@mui/material';
import {NextPage} from 'next';
import React, {useEffect, useMemo, useRef, useState} from 'react';
import {MapService} from '../services/google';

type ClickEvent = {
  latLng: google.maps.LatLng;
  feature: {
    h: MapProperties;
  };
};

const PreviewPage: NextPage = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [showCoverage, setShowCoverage] = useState<boolean>(false);

  function handleStreetViewCoverage() {
    setShowCoverage(!showCoverage);
  }
  const features = useMemo(() => Array.from(MAPS.values()), []);

  useEffect(() => {
    if (ref.current) {
      const unmount = MapService.mount(ref.current);
      MapService.map.setOptions(config.map);

      // Each map is a GeoJSON Featurecollection that could
      // potentially include multiple GeoJSON features. In practice,
      // each collection ("const feature" below) will only contain one
      // feature
      const geojson = features.reduce((acc, curr) => {
        const feature = MapService.map.data.addGeoJson(curr);
        acc.push(...feature);
        return acc;
      }, [] as google.maps.Data.Feature[]);

      MapService.map.setCenter({lat: 35, lng: 0});
      MapService.map.setZoom(3);

      MapService.map.data.setStyle({
        fillColor: '#e46fb7',
        fillOpacity: 0.1,
        strokeWeight: 0.8,
      });

      const listener = MapService.map.data.addListener(
        'click',
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (event: ClickEvent) => {
          const coords = event.latLng.toJSON();
          const hits = features.reduce((acc, curr) => {
            if (isInPolygon(coords, curr.geometry)) {
              acc.push(curr.properties);
            }
            return acc;
          }, [] as MapProperties[]);
          console.info(hits.map(m => m.name));
        }
      );

      return () => {
        geojson.forEach(feat => {
          MapService.map.data.remove(feat);
        });
        listener.remove();
        unmount();
      };
    }
  }, [features]);

  useEffect(() => {
    if (showCoverage) {
      const coverageLayer = new google.maps.StreetViewCoverageLayer();
      coverageLayer.setMap(MapService.map);
      return () => {
        coverageLayer.setMap(null);
      };
    }
  }, [showCoverage]);

  return (
    <>
      <Header />
      <PageContent headerGutter id="preview-page">
        <div
          ref={ref}
          style={{
            height: '100%',
            width: '100%',
          }}
        />
        <FormGroup
          sx={{
            position: 'absolute',
            bottom: 30,
            padding: '0 1rem',
            backgroundColor: ({palette}) =>
              alpha(palette.background.default, 0.6),
            borderRadius: 3,
          }}
        >
          <FormControlLabel
            control={
              <Checkbox
                checked={showCoverage}
                onChange={handleStreetViewCoverage}
              />
            }
            label="Show street view coverage"
          />
        </FormGroup>
      </PageContent>
    </>
  );
};

export default PreviewPage;
