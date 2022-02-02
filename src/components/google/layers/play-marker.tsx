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

    const listener = MapService.map.addListener(
      'click',
      ({latLng}: google.maps.MapMouseEvent) => {
        if (marker && latLng) {
          marker.setPosition(latLng);
          dispatch(
            updateSelectedPosition({lat: latLng.lat(), lng: latLng.lng()})
          );
        }
      }
    );

    return () => {
      listener.remove();
      marker?.setMap(null);
      marker = null;
    };
  }, [dispatch]);

  return null;
};
