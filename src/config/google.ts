type GoogleConfig = {
  svRequest: google.maps.StreetViewLocationRequest;
  streetview: google.maps.StreetViewPanoramaOptions;
  map: google.maps.MapOptions;
};

export const config: GoogleConfig = {
  svRequest: {
    radius: 1000,
  },
  streetview: {
    zoom: 0,
    addressControl: false,
    motionTracking: false,
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
    mapTypeId: 'hybrid',
    mapTypeControl: true,
    gestureHandling: 'auto',
    mapTypeControlOptions: {
      mapTypeIds: ['hybrid', 'roadmap'],
    },
  },
};
