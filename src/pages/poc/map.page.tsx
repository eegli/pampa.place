import {GoogleMapContainer} from '../../components/google/gmap-container';
import {PageContent} from '../../styles/containers';

export default function TestPage() {
  return (
    <PageContent id="preview-page">
      <GoogleMapContainer
        center={{lat: 35, lng: 1}}
        zoom={4}
        onLoad={map => {
          map.setCenter({lat: 1, lng: 2});
        }}
      >
        <div></div>
      </GoogleMapContainer>
    </PageContent>
  );
}
