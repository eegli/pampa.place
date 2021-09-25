type GoogleConfig = {
  svRequest: google.maps.StreetViewLocationRequest;
  streetview: google.maps.StreetViewPanoramaOptions;
  map: google.maps.MapOptions;
};

const googleConfig: GoogleConfig = {
  svRequest: {
    radius: 1000,
  },
  streetview: {
    addressControl: false,
    zoomControl: false,
    showRoadLabels: false,
    fullscreenControl: false,
    pov: {
      heading: 35,
      pitch: 10,
    },
  },
  map: {
    draggableCursor: 'crosshair',
    clickableIcons: false,
    disableDefaultUI: true,
    mapTypeId: 'roadmap',
    mapTypeControl: true,
    mapTypeControlOptions: {
      mapTypeIds: ['roadmap', 'hybrid'],
    },
  },
};

export default googleConfig;
