import {useAppDispatch} from '@/redux/hooks';
import {updateSelectedPosition} from '@/redux/position';
import {MapService} from '@/services/google';
import {useEffect} from 'react';

export const GoogleMapPlayMarkerLayer = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    let marker: google.maps.Marker | null = new google.maps.Marker();
    marker.setMap(MapService.map);
    marker.setDraggable(true);

    const listener = MapService.map.addListener('click', (e: unknown) => {
      const {latLng} = e as {latLng: google.maps.LatLng};
      if (marker) marker.setPosition(latLng);
      dispatch(updateSelectedPosition({lat: latLng.lat(), lng: latLng.lng()}));
    });

    return () => {
      listener.remove();
      marker = null;
    };
  }, [dispatch]);

  return null;
};
