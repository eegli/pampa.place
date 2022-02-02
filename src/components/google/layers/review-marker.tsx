import {config} from '@/config/google';
import {MapService, MarkerService, PolyLineService} from '@/services/google';
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
      const originMarker = new google.maps.Marker();

      originMarker.setPosition(initialPosition);
      originMarker.setMap(MapService.map);

      MarkerService.add(originMarker);

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

          const polyLine = new google.maps.Polyline({
            path: [initialPosition, p.selected],
            map: MapService.map,
            geodesic: true,
            strokeColor: `#${config.marker.colors[idx]}`,
            strokeOpacity: 1.0,
            strokeWeight: 4,
          });
          PolyLineService.add(polyLine);
          MarkerService.add(playerMarker);
        }
      });

      return () => {
        MarkerService.clearAllItems();
        PolyLineService.clearAllItems();
      };
    }
  }, [scores, initialPosition]);

  return null;
};
