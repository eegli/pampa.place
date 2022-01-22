import {LatLng, Size} from '@googlemaps/jest-mocks';

export const GoogleStreetViewResponse: google.maps.StreetViewResponse = {
  data: {
    copyright: 'Copyright',
    imageDate: 'August 2020',
    links: [],
    location: {
      description: 'Fake panorama description',
      pano: '69',
      shortDescription: null,
      latLng: new LatLng(1, 2),
    },
    tiles: {
      centerHeading: 0,
      getTileUrl: () => '',
      tileSize: new Size(1, 1),
      worldSize: new Size(1, 1),
    },
  },
};
