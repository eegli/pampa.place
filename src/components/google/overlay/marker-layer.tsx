import {useEffect} from 'react';
import {useAppDispatch} from '../../../redux/hooks';
import {updateSelectedPosition} from '../../../redux/position';
import {MapService, MarkerService} from '../../../services/google';

export const GoogleMapMarkerLayer = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const marker = new google.maps.Marker();
    marker.setMap(MapService.map);
    marker.setDraggable(true);
    MarkerService.add(marker);

    const listener = MapService.map.addListener('click', (e: unknown) => {
      const {latLng} = e as {latLng: google.maps.LatLng};
      marker.setPosition(latLng);
      dispatch(updateSelectedPosition({lat: latLng.lat(), lng: latLng.lng()}));
    });

    return () => {
      listener.remove();
      MarkerService.clearAllItems();
    };
  }, [dispatch]);

  return null;
};
