type GoogleConfig = {
  svRequest: {
    radius: number;
  }; // google.maps.StreetViewLocationRequest;
  streetview: google.maps.StreetViewPanoramaOptions;
  map: google.maps.MapOptions;
};

export const config: GoogleConfig = {
  svRequest: {
    radius: 100,
  },
  streetview: {
    zoom: 0,
    clickToGo: true,
    disableDoubleClickZoom: false,
    addressControl: false,
    motionTracking: false,
    motionTrackingControl: false,
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
    gestureHandling: 'auto',
    mapTypeControlOptions: {
      mapTypeIds: ['hybrid', 'roadmap'],
    },
  },
};
