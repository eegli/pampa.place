## Google Components

In general, the Google Map component is very generic. It only needs either a center or lat/lng bounds in order to mound. Re-renders are prevented if the id of the map is the same. This is useful for play mode when the map is toggled but not changed.

Simple map interactions like adding GeoJSON can be done in the main map component. Just make sure to cleanup properly on unmount - e.g. remove GeoJSON layers.

More advanced stuff may have its own layer component in `/layers`. A layer is meant to be a direct child of the mother map component. These components may or may not return a ReactNode. If they do, they need to have an absolute position in order to be displayed above the map.

In most cases, these layers serve a specific purpose - like adding a marker with a listener in game mode or displaying player results. Due to their complexity, they are directly tied to the global state and may not be repurposed. Since only a handful of map interactions fall into this category, I guess that's fine. I'm open for better solutions.

### Good to know

Some Google Map overlays need to be cleaned up in a specific way.

- https://developers.google.com/maps/documentation/javascript/markers#remove
