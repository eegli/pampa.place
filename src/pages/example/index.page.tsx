import {config} from '@/config/google';
import {Button} from '@mui/material';
import {Box} from '@mui/system';
import {NextPage} from 'next';
import {useEffect, useRef, useState} from 'react';
import {Header} from '../../components/nav/header/header';
import {MapService} from '../../services/google';
import {PageContentWrapper} from '../../styles/containers';

const GoodMapsComponent = () => {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (ref.current) {
      console.info('mount');
      const unmount = MapService.mount(ref.current);
      MapService.map.setOptions(config.map);
      MapService.map.setCenter({lat: 35, lng: 0});
      MapService.map.setZoom(3);

      return () => {
        console.info('unmount');
        unmount();
      };
    }
  }, []);
  return (
    <div
      ref={ref}
      style={{
        height: '100%',
        width: '100%',
      }}
    />
  );
};

const BadMapsComponent = () => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current) {
      console.info('mount');
      const map = new google.maps.Map(ref.current);
      map.setOptions(config.map);
      map.setCenter({lat: 35, lng: 0});
      map.setZoom(3);
      return () => {
        console.info('unmount');
      };
    }
  }, []);

  return (
    <div
      ref={ref}
      style={{
        height: '100%',
        width: '100%',
      }}
    />
  );
};

const ExamplePage: NextPage = () => {
  const [showGood, setShowGood] = useState(false);
  const [showBad, setShowBad] = useState(false);
  return (
    <>
      <Header />
      <PageContentWrapper headerGutter id="preview-page">
        <Box height="100%" width="100%">
          <Box display="flex" mt={2}>
            <Box flex="1 0 auto" height={300} p={2}>
              <Box>Variant: Good</Box>
              {showGood ? <GoodMapsComponent /> : null}
            </Box>
            <Box flex="1 0 auto" height={300} p={2}>
              <Box>Variant: Bad</Box>
              {showBad ? <BadMapsComponent /> : null}
            </Box>
          </Box>
          <Box
            mt={2}
            alignSelf="center"
            display="flex"
            width="100%"
            justifyContent="space-evenly"
          >
            <Button variant="contained" onClick={() => setShowGood(s => !s)}>
              Toggle good
            </Button>
            <Button variant="contained" onClick={() => setShowBad(s => !s)}>
              Toggle Bad
            </Button>
          </Box>
        </Box>
      </PageContentWrapper>
    </>
  );
};

export default ExamplePage;