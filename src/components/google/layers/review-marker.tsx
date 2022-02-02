import {config} from '@/config/google';
import {MapService} from '@/services/google';
import {useEffect} from 'react';
import {getCurrentRoundScores} from '../../../redux/game/selectors';
import {useAppSelector} from '../../../redux/hooks';

export const GoogleMapReviewMarkerLayer = () => {
  const initialPosition = useAppSelector(
    ({position}) => position.initialPosition
  );
  const scores = useAppSelector(getCurrentRoundScores);

  useEffect(() => {
    if (initialPosition) {
      // Add original location marker
      let markers = [new google.maps.Marker()];

      markers[0].setPosition(initialPosition);
      markers[0].setMap(MapService.map);

      // Add marker for each result
      scores.forEach((p, idx) => {
        if (p.selected) {
          const playerMarker = new google.maps.Marker({
            position: p.selected,
            map: MapService.map,
            label: {
              text: p.name,
              color: 'white',
              className: 'map-marker',
            },
            icon: {
              path: config.marker.svg.path,
              fillColor: `#${config.marker.colors[idx]}`,
              fillOpacity: 1,
              anchor: new google.maps.Point(
                config.marker.svg.anchor[0],
                config.marker.svg.anchor[1]
              ),
              strokeWeight: 0,
              scale: 1,
              labelOrigin: new google.maps.Point(15, 60),
            },
          });

          new google.maps.Polyline({
            path: [initialPosition, p.selected],
            map: MapService.map,
            geodesic: true,
            strokeColor: `#${config.marker.colors[idx]}`,
            strokeOpacity: 1.0,
            strokeWeight: 4,
          });
          markers.push(playerMarker);
        }
      });
      // Cleanup is important!
      // https://developers.google.com/maps/documentation/javascript/examples/marker-remove
      return () => {
        markers.forEach(m => m.setMap(null));
        markers = [];
      };
    }
  }, [scores, initialPosition]);

  return null;
};
